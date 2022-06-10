from email.headerregistry import Group
from enum import Enum
from nis import cat
from sre_constants import SUCCESS
from django.db import IntegrityError
from django.shortcuts import render

# Create your views here.
from django.contrib.auth import authenticate
from courses.models import Course

from backend.permissions import IsStudent

from .serializers import StudentDataSerializer, TeacherDataSerializer, UserDataSerializer
from .models import Grade, Role, User, Student, Teacher
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
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
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail

class ResponseCode(Enum):
    NO_PASSWORD_OR_EMAIL_PROVIDED = 'NO_PASSWORD_OR_EMAIL_PROVIDED'
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
    ACCOUNT_NOT_VERIFIED = 'ACCOUNT_NOT_VERIFIED'
    PASSWORD_NOT_CHANGED = 'PASSWORD_NOT_CHANGED'
    ALREADY_REGISTERED = 'ALREADY_REGISTERED'
    USER_NOT_FOUND = 'USER_NOT_FOUND'
    STUDENT_NOT_FOUND = 'STUDENT_NOT_FOUND'
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
    user_serializer = UserDataSerializer(user)
    
    return Response({
            'token': token.key,
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

    email_plaintext_message = "{}?token={}".format(reverse('password_reset:reset-password-request'), reset_password_token.key)

    send_mail(
        # title:
        "Password Reset for {title}".format(title="Some website title"),
        # message:
        email_plaintext_message,
        # from:
        "noreply@somehost.local",
        # to:
        [reset_password_token.user.email]
    )

@api_view(["POST"])
@permission_classes([AllowAny])
def register_batch_students(request):
    students = request.data.get("students")
    error_messages = []

    for idx, student in enumerate(students):
        if not student['email']:
            error_messages.append("Row {}: The email wasn't provided".format(idx))
        
        try:
            User.objects.create_user(
                email=student['email'],
                password='Password@123',
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

    return Response(
        {
            'code': ResponseCode.SUCCESS.value,
            'error_messages': error_messages
        },
        status=HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([AllowAny])
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
                password='Password@123',
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

    return Response(
        {
            'code': ResponseCode.SUCCESS.value,
            'error_messages': error_messages
        },
        status=HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
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

    return Response({
        'code': ResponseCode.SUCCESS.value
        },
        status=HTTP_200_OK
    )


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
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
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
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
        Student.objects.filter(user=user).update(
            domain=domain,
            learning_mode=learning_mode,
            degree=degree,
            study_program=study_program,
            current_group=current_group,
            current_year=current_year
        )
    except Student.DoesNotExist:
        return Response({
            'code': ResponseCode.STUDENT_NOT_FOUND.value
            },
            status=HTTP_200_OK
        )   

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
    return Response({
        'code': ResponseCode.SUCCESS.value
        },
        status=HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([AllowAny])
def teachers(request):
    teachers = Teacher.objects.all()
    serializer = TeacherDataSerializer(teachers, many=True)
    return Response({
        'teachers': serializer.data,
        'code': ResponseCode.SUCCESS.value
        },
        status=HTTP_200_OK
    )
