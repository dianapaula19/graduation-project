import email
from django.core.mail import EmailMultiAlternatives
from enum import Enum
from django.conf import settings
from django.db import IntegrityError
from django.db.models import ProtectedError

# Create your views here.
from django.contrib.auth import authenticate
from courses.models import OptionsList
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
from django_rest_passwordreset.signals import reset_password_token_created, post_password_reset
from django.core.mail import send_mail

class ResponseCode(Enum):
  NO_PASSWORD_OR_EMAIL_PROVIDED = 'NO_PASSWORD_OR_EMAIL_PROVIDED'
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
  ACCOUNT_NOT_VERIFIED = 'ACCOUNT_NOT_VERIFIED'
  PASSWORD_NOT_CHANGED = 'PASSWORD_NOT_CHANGED'
  ACCOUNT_ALREADY_EXISTS = 'ACCOUNT_ALREADY_EXISTS'
  NOT_EMAIL = 'NOT_EMAIL'
  USER_NOT_FOUND = 'USER_NOT_FOUND'
  STUDENT_NOT_FOUND = 'STUDENT_NOT_FOUND'
  EMAIL_NOT_SENT = 'EMAIL_NOT_SENT'
  TEACHER_HAS_COURSE = 'TEACHER_HAS_COURSE'
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
      'code': ResponseCode.ACCOUNT_ALREADY_EXISTS.value
      },
      status=HTTP_500_INTERNAL_SERVER_ERROR
    )

  try:
    send_mail(
      subject="[FMI] Account created successfully",
      message="Congrats. Your account was creates successfully.",
      from_email=settings.EMAIL_HOST_USER,
      to=settings.EMAIL_HOST_USER,
      recipient_list=[email],
      fail_silently=False
    )
  except:
    return Response({
      'code': ResponseCode.EMAIL_NOT_SENT.value
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
def post_password_reset(sender, user, *args, **kwargs):
  user.changed_password = True
  user.save()

@api_view(["POST"])
@permission_classes([IsAdmin])
def register_batch_students(request):
  students = request.data.get("students")
  error_messages = []
  recipient_list = []

  for idx, student in enumerate(students):
    if not student['email']:
      error_messages.append({
        'index': idx,
        'code': ResponseCode.NOT_EMAIL.value
      })
      continue
    
    try:
      User.objects.create_user(
        email=student['email'],
        password=settings.DEFAULT_PASSWORD,
        first_name=student['first_name'],
        last_name=student['last_name'],
        role=Role.STUDENT,
        verified=True,
        changed_password=False
      )
    except IntegrityError:
      error_messages.append({
        'index': idx,
        'code': ResponseCode.ACCOUNT_ALREADY_EXISTS.value
      })
      continue

    user = User.objects.get(email=student['email'])
        
    s = Student.objects.create(
      user=user,
      domain=student['domain'],
      learning_mode=student['learning_mode'],
      study_program=student['study_program'],
      degree=student['degree'],
      current_group=student['current_group'],
      current_year=student['current_year']
    )

    grade1 = float(student['grade1'])
    grade2 = float(student['grade2'])
    grade3 = float(student['grade3'])
    grade4 = float(student['grade4'])

    if grade1 and grade1 != 0.0:
      obj, created = Grade.objects.update_or_create(
        student=s,
        year=1,
        defaults=dict(
          grade=grade1
        )
      )

    if grade2 and grade2 != 0.0:
      obj, created = Grade.objects.update_or_create(
        student=s,
        year=2,
        defaults=dict(
          grade=grade2
        )
      )

    if grade3 and grade3 != 0.0:
      obj, created = Grade.objects.update_or_create(
        student=s,
        year=3,
        defaults=dict(
          grade=grade3
        )
      )

    if grade4 and grade4 != 0.0:
      obj, created = Grade.objects.update_or_create(
        student=s,
        year=4,
        defaults=dict(
          grade=grade4
        )
      )

    options_lists = OptionsList.objects.all()
    for options_list in options_lists:
      if s.domain == options_list.domain and \
        s.learning_mode == options_list.learning_mode and \
        s.study_program == options_list.study_program and \
        s.degree == options_list.degree and \
        s.current_year == (options_list.year - 1):
        s.options_lists.add(options_list)
    
    s.save()

    recipient_list.append(student['email'])

  try:
    email = EmailMultiAlternatives(
      subject="[FMI] Account created successfully",
      body="Congrats. Your account was created successfully. Please change your password before logging in",
      from_email=settings.EMAIL_HOST_USER,
      to=[settings.EMAIL_HOST_USER], 
      bcc=recipient_list
    )
    email.send()
  except:
    return Response({
      'code': ResponseCode.EMAIL_NOT_SENT.value,
      },
      status=HTTP_500_INTERNAL_SERVER_ERROR
    )

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
  recipient_list = []

  for idx, teacher in enumerate(teachers):
    if not teacher['email']:
      error_messages.append({
        'index': idx,
        'code': ResponseCode.NOT_EMAIL.value
      })
      continue
    try:
      User.objects.create_user(
        email=teacher['email'],
        password=settings.DEFAULT_PASSWORD,
        first_name=teacher['first_name'],
        last_name=teacher['last_name'],
        role=Role.TEACHER,
        verified=True,
        changed_password=False
      )
    except IntegrityError:
      error_messages.append({
        'index': idx,
        'code': ResponseCode.ACCOUNT_ALREADY_EXISTS.value
      })
      continue
    
    user = User.objects.get(email=teacher['email'])
    Teacher.objects.create(user=user)
    recipient_list.append(teacher['email'])

  try:
    email = EmailMultiAlternatives(
      subject="[FMI] Account created successfully",
      body="Congrats. Your account was created successfully. Please change your password before logging in",
      from_email=settings.EMAIL_HOST_USER,
      to=[settings.EMAIL_HOST_USER], 
      bcc=recipient_list
    )
    email.send()
  except:
    return Response({
        'code': ResponseCode.EMAIL_NOT_SENT.value,
        'error_messages': error_messages
      },
      status=HTTP_500_INTERNAL_SERVER_ERROR
    )

  return Response({
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

@api_view(["POST"])
@permission_classes([IsAdmin])
def delete_user(request):
  
  email = request.data.get("email")
  
  try:
    User.objects.filter(email=email).delete()
  except:
    return Response({
      'code': ResponseCode.TEACHER_HAS_COURSE.value
      },
      status=HTTP_500_INTERNAL_SERVER_ERROR
    )

  return Response({
      'code': ResponseCode.SUCCESS.value
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
      recipient_list=[email],
      fail_silently=False
    )
  except:
    return Response({
      'code': ResponseCode.EMAIL_NOT_SENT.value
      },
      status=HTTP_500_INTERNAL_SERVER_ERROR
    )  

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

  first_name = request.data.get("first_name")
  last_name = request.data.get("last_name")
  
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
  
  user.first_name = first_name
  user.last_name = last_name
  student.domain = domain
  student.learning_mode = learning_mode
  student.degree = degree
  student.study_program = study_program
  student.current_group = current_group
  student.current_year = current_year

  if grades:   
    try:
      for grade in grades:
        if grade != 0.0:
          obj, created = Grade.objects.update_or_create(
            student=student,
            year=grade['year'],
            defaults=dict(
              grade=grade['grade']
            )
          )
    except:
      return Response({
        'code': ResponseCode.ERROR.value
        },
        status=HTTP_200_OK
      )

  options_lists = OptionsList.objects.all()
  for options_list in options_lists:
    if student.domain == options_list.domain and \
      student.learning_mode == options_list.learning_mode and \
      student.study_program == options_list.study_program and \
      student.degree == options_list.degree and \
      student.current_year == (options_list.year - 1):
      student.options_lists.add(options_list)
      
  user.save()
  student.save()

  return Response({
    'code': ResponseCode.SUCCESS.value
    },
    status=HTTP_200_OK
  )

@api_view(["GET", "POST", "DELETE"])
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

  User.objects.filter(email=email).update(
    first_name=first_name,
    last_name=last_name
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
  teacher_email = request.data.get("teacher_email")
  recipient_list = request.data.get("recipient_list")

  try:
    email = EmailMultiAlternatives(
      subject="[FMI] " + subject,
      body=message,
      from_email=settings.EMAIL_HOST_USER,
      to=[teacher_email], 
      bcc=recipient_list,
      reply_to=[teacher_email]
    )
    email.send()
  except:
    return Response({
      'code': ResponseCode.EMAIL_NOT_SENT.value
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

  