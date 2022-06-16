from email.headerregistry import Group
from enum import Enum
from django.conf import settings
from django.db import IntegrityError

# Create your views here.
from django.contrib.auth import authenticate
from backend.permissions import IsAdmin, IsStudent, IsTeacher

from courses.utils import students_courses_assignment

from .utils import get_students_lists_fun, reset_data

from .serializers import StudentDataSerializer, StudentsListSerializer, TeacherDataSerializer, UserDataSerializer
from .models import AppSetting, Grade, Role, SelectionSessionSettingValue, User, Student, Teacher
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.status import (
  HTTP_400_BAD_REQUEST,
  HTTP_404_NOT_FOUND,
  HTTP_403_FORBIDDEN,
  HTTP_200_OK,
  HTTP_500_INTERNAL_SERVER_ERROR
)
from rest_framework.response import Response
from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created, post_password_reset
from django.core.mail import send_mail

class ResponseCode(Enum):
  NO_PASSWORD_OR_EMAIL_PROVIDED = 'NO_PASSWORD_OR_EMAIL_PROVIDED'
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
  ACCOUNT_NOT_VERIFIED = 'ACCOUNT_NOT_VERIFIED'
  PASSWORD_NOT_CHANGED = 'PASSWORD_NOT_CHANGED'
  ALREADY_REGISTERED = 'ALREADY_REGISTERED'
  USER_NOT_FOUND = 'USER_NOT_FOUND'
  STUDENT_NOT_FOUND = 'STUDENT_NOT_FOUND'
  COULD_NOT_SEND_EMAIL = 'COULD_NOT_SEND_EMAIL'
  ERROR = 'ERROR'
  SUCCESS = 'SUCCESS'

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
  email = request.data.get("email")
  password = request.data.get("password")
  
  if not email or not password:
    return Response({
      'code': ResponseCode.NO_PASSWORD_OR_EMAIL_PROVIDED.value
      },
      status=HTTP_400_BAD_REQUEST
    )

  user = authenticate(email=email, password=password)
  
  if not user:
    return Response({
      'code': ResponseCode.INVALID_CREDENTIALS.value
      },
      status=HTTP_404_NOT_FOUND
    )

  if user.verified == False:
    return Response({
      'code': ResponseCode.ACCOUNT_NOT_VERIFIED.value
    },
    status=HTTP_403_FORBIDDEN
    )

  if not user.changed_password:
    return Response({
      'code': ResponseCode.PASSWORD_NOT_CHANGED.value
    },
    status=HTTP_403_FORBIDDEN
    )

  token, _ = Token.objects.get_or_create(user=user)
  selection_session_open = AppSetting.objects.filter(key='SELECTION_SESSION_OPEN')[0]
  user_serializer = UserDataSerializer(user)
  
  return Response({
      'token': token.key,
      'selection_session_open': selection_session_open.value,
      'user_data': user_serializer.data,
      'code': ResponseCode.SUCCESS.value 
      },
    status=HTTP_200_OK
  )


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
  email = request.data.get("email")
  password = request.data.get("password")

  if not email or not password:
    return Response({
      'code': ResponseCode.NO_PASSWORD_OR_EMAIL_PROVIDED.value
      },
      status=HTTP_400_BAD_REQUEST
    )

  try:
    User.objects.create_user(
      email=email, 
      password=password, 
      verified=False,
      changed_password=True
    )
  except IntegrityError:
    return Response({
      'code': ResponseCode.ALREADY_REGISTERED.value
      },
      status=HTTP_500_INTERNAL_SERVER_ERROR
    )

  return Response({
    'code': ResponseCode.SUCCESS.value
    }, 
    status=HTTP_200_OK
  )

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):

  email_plaintext_message = "http://localhost:3000/resetPassword/?token={}".format(reset_password_token.key)
  
  send_mail(
    subject="Password Reset",
    message=email_plaintext_message,
    from_email=settings.EMAIL_HOST_USER,
    recipient_list=[reset_password_token.user.email]
  )

@receiver(post_password_reset)
def post_password_reset(sender,  user, *args, **kwargs):
  user.changed_password = True
  user.save()

@api_view(["POST"])
@permission_classes([IsAdmin])
def register_batch_students(request):
  students = request.data.get("students")
  error_messages = []

  for idx, student in enumerate(students):
    if not student['email']:
      error_messages.append("Row {}: The email wasn't provided".format(idx))
    
    try:
      User.objects.create_user(
        email=student['email'],
        password=settings.DEFAULT_PASSWORD,
        first_name=student['first_name'],
        last_name=student['last_name'],
        verified=True,
        changed_password=False
      )
    except IntegrityError:
      error_messages.append("An account with the email {} already exists".format(student['email']))
      continue

    user = User.objects.get(email=student['email'])
        
    Student.objects.create(
      user=user,
      domain=student['domain'],
      learning_mode=student['learning_mode'],
      study_program=student['study_program'],
      degree=student['degree'],
      current_group=student['current_group'],
      current_year=student['current_year']
    )
    try:
      send_mail(
        subject="Account created successfully",
        message="Congrats. Your account was create successfully.",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[student['email']]
      )
    except:
      error_messages.append("Row {}: Couldn't send email to the newly created user".format(idx))

  return Response(
    {
      'code': ResponseCode.SUCCESS.value,
      'error_messages': error_messages
    },
    status=HTTP_200_OK
  )

@api_view(["POST"])
@permission_classes([IsAdmin])
def register_batch_teachers(request):
  teachers = request.data.get("teachers")
  error_messages = []

  for idx, teacher in enumerate(teachers):
    if not teacher['email']:
      error_messages.append("Row {}: The email wasn't provided".format(idx))
      continue
    try:
      User.objects.create(
        email=teacher['email'],
        password=settings.DEFAULT_PASSWORD,
        first_name=teacher['first_name'],
        last_name=teacher['last_name'],
        verified=True,
        changed_password=False
      )
    except IntegrityError:
      error_messages.append("An account with the email {} already exists".format(teacher['email']))
      continue
    
    user = User.objects.get(email=teacher['email'])
    Teacher.objects.create(user=user)
    try:
      send_mail(
        subject="Account created successfully",
        message="Congrats. Your account was create successfully.",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[teacher['email']]
      )
    except:
      pass

  return Response(
    {
      'code': ResponseCode.SUCCESS.value,
      'error_messages': error_messages
    },
    status=HTTP_200_OK
  )

@api_view(["POST"])
@permission_classes([IsStudent])
def get_student_data(request):
  email = request.data.get("email")

  try:
    user = User.objects.get(email=email)
  except:
    user = None
  if not user:
    return Response({
      'code': ResponseCode.USER_NOT_FOUND.value
    },
    status=HTTP_404_NOT_FOUND
    )
  
  student = Student.objects.get(user=user)

  if not student:
    return Response({
      'code': ResponseCode.STUDENT_NOT_FOUND.value
    },
    status=HTTP_404_NOT_FOUND
    )

  student_serializer = StudentDataSerializer(student)

  return Response({
      'code': ResponseCode.SUCCESS.value,
      'student_data': student_serializer.data
    },
    status=HTTP_200_OK
  )

@api_view(["GET", "POST"])
@permission_classes([IsAdmin])
def not_verified_users(request):
  if request.method == "GET":
    users = User.not_verified_users.all()
    data = [user.email for user in users]    
    return Response({
      'users': data,
      'code': ResponseCode.SUCCESS.value
      },
      status=HTTP_200_OK
    )
  
  email = request.data.get("email")
  first_name = request.data.get("first_name")
  last_name = request.data.get("last_name")
  role = request.data.get("role")

  try:
    user = User.objects.get(email=email)
    User.objects.filter(email=email).update(
      first_name=first_name,
      last_name=last_name,
      role=role,
      verified=True
    )
    if role == Role.STUDENT:
      Student.objects.create(user=user)
    if role == Role.TEACHER:
      Teacher.objects.create(user=user)
  except User.DoesNotExist:
    return Response({
      'code': ResponseCode.USER_NOT_FOUND.value
      },
      status=HTTP_200_OK
    )  
  try:
    send_mail(
      subject="Account Verified",
      message="Congrats. Your account was verfied successfully",
      from_email=settings.EMAIL_HOST_USER,
      recipient_list=[email]
    )
  except:
    pass  

  return Response({
    'code': ResponseCode.SUCCESS.value
    },
    status=HTTP_200_OK
  )


@api_view(["GET", "POST"])
@permission_classes([IsAdmin])
def students(request):
  if request.method == "GET":
    students = Student.objects.all()
    serializer = StudentDataSerializer(students, many=True)
    return Response({
      'students': serializer.data,
      'code': ResponseCode.SUCCESS.value
      },
      status=HTTP_200_OK
    )
  
  email = request.data.get("email")
  print(request.data)
  
  try:
    user = User.objects.get(email=email)
  except:
    return Response({
      'code': ResponseCode.USER_NOT_FOUND.value
      },
      status=HTTP_200_OK
    )

  domain = request.data.get("domain")
  learning_mode = request.data.get("learning_mode")
  degree = request.data.get("degree")
  study_program = request.data.get("study_program")
  grades = request.data.get("grades")
  current_group = request.data.get("current_group")
  current_year = request.data.get("current_year")

  try:
    student = Student.objects.get(user=user)
  except Student.DoesNotExist:
    return Response({
      'code': ResponseCode.STUDENT_NOT_FOUND.value
      },
      status=HTTP_200_OK
    )
  student.domain = domain
  student.learning_mode = learning_mode
  student.degree = degree
  student.study_program = study_program
  student.current_group = current_group
  student.current_year = current_year

  if grades:   
    try:
      for grade in grades:
        Grade.objects.update_or_create(
          student=student,
          year=grade.year,
          defaults={
            'year': grade.year,
            'grade': grade.grade
          }
        )
    except:
      return Response({
        'code': ResponseCode.ERROR.value
        },
        status=HTTP_500_INTERNAL_SERVER_ERROR
      )  
  
  student.save()
  return Response({
    'code': ResponseCode.SUCCESS.value
    },
    status=HTTP_200_OK
  )

@api_view(["GET", "POST"])
@permission_classes([IsAdmin])
def teachers(request):
  if request.method == "GET":
    teachers = Teacher.objects.all()
    serializer = TeacherDataSerializer(teachers, many=True)
    return Response({
      'teachers': serializer.data,
      'code': ResponseCode.SUCCESS.value
      },
      status=HTTP_200_OK
    )
  
  email = request.data.get("email")
  first_name = request.data.get("first_name")
  last_name = request.data.get("last_name")

  try:
    User.objects.filter(email=email).update(
      first_name=first_name,
      last_name=last_name
    )
  except:
    return Response({
      'code': ResponseCode.ERROR.value
      },
      status=HTTP_500_INTERNAL_SERVER_ERROR
    )
  
  return Response({
      'code': ResponseCode.SUCCESS.value
      },
      status=HTTP_500_INTERNAL_SERVER_ERROR
  )

@api_view(["POST"])
@permission_classes([IsTeacher])
def send_announcement(request):
  subject = request.data.get("subject")
  message = request.data.get("message")
  from_email = request.data.get("from_email")
  recipient_list = request.data.get("recipient_list")

  try:
    send_mail(
      subject=subject,
      message=message,
      from_email=from_email,
      recipient_list=recipient_list
    )
  except:
    return Response({
        'code': ResponseCode.COULD_NOT_SEND_EMAIL.value
      },
      status=HTTP_500_INTERNAL_SERVER_ERROR
    )
  
  return Response({
      'code': ResponseCode.SUCCESS.value
    },
    status=HTTP_200_OK
  )

@api_view(["POST"])
@permission_classes([IsAdmin])
def update_selection_session_open(request):
  value = request.data.get("value")
  try:
    if value == SelectionSessionSettingValue.TRUE.value:
      reset_data()
    if value == SelectionSessionSettingValue.FALSE.value:
      students_courses_assignment()

    AppSetting.objects.filter(key="SELECTION_SESSION_OPEN").update(
      value=value
    )
  except:
    return Response({
        'code': ResponseCode.ERROR.value
      },
      status=HTTP_500_INTERNAL_SERVER_ERROR
    )

  return Response({
      'code': ResponseCode.SUCCESS.value
    },
    status=HTTP_200_OK
  )

@api_view(["GET"])
@permission_classes([IsAdmin])
def get_students_lists(request):
  
  try:
    lists = get_students_lists_fun()
  except:
    return Response({
        'code': ResponseCode.ERROR
      },
      status=HTTP_500_INTERNAL_SERVER_ERROR
    )
  return Response({
      'code': ResponseCode.SUCCESS.value,
      'lists': StudentsListSerializer(lists, many=True).data
    },
    status=HTTP_200_OK
  )

  