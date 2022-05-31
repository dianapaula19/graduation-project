from email.headerregistry import Group
from enum import Enum
from nis import cat
from sre_constants import SUCCESS
from django.db import IntegrityError
from django.shortcuts import render

# Create your views here.
from django.contrib.auth import authenticate

from backend.permissions import IsStudent

from .serializers import StudentDataSerializer, UserSerializer
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

class LoginResponseCode(Enum):
    NO_PASSWORD_OR_EMAIL_PROVIDED = 'NO_PASSWORD_OR_EMAIL_PROVIDED'
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
    ACCOUNT_NOT_VERIFIED = 'ACCOUNT_NOT_VERIFIED'
    PASSWORD_NOT_CHANGED = 'PASSWORD_NOT_CHANGED'
    SUCCESS = 'SUCCESS'

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    
    if not email or not password:
        return Response({
            'code': LoginResponseCode.NO_PASSWORD_OR_EMAIL_PROVIDED.value
            },
            status=HTTP_400_BAD_REQUEST
        )

    user = authenticate(email=email, password=password)
    
    if not user:
        return Response({
            'code': LoginResponseCode.INVALID_CREDENTIALS.value
            },
            status=HTTP_404_NOT_FOUND
        )

    if user.verified == False:
        return Response({
            'code': LoginResponseCode.ACCOUNT_NOT_VERIFIED.value
        },
        status=HTTP_403_FORBIDDEN
        )

    if not user.changed_password:
        return Response({
            'code': LoginResponseCode.PASSWORD_NOT_CHANGED.value
        },
        status=HTTP_403_FORBIDDEN
        )

    token, _ = Token.objects.get_or_create(user=user)
    user_serializer = UserSerializer(user)
    
    return Response({
        'token': token.key,
        'user_data': user_serializer.data,
        'message': 'Successful login' 
        },
        status=HTTP_200_OK
    )

class RegisterResponseCode(Enum):
    NO_PASSWORD_OR_EMAIL_PROVIDED = 'NO_PASSWORD_OR_EMAIL_PROVIDED'
    ALREADY_REGISTERED = 'ALREADY_REGISTERED',
    SUCCESS = 'SUCCESS'

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({
            'code': RegisterResponseCode.NO_PASSWORD_OR_EMAIL_PROVIDED.value
            },
            status=HTTP_400_BAD_REQUEST
        )

    try:
        User.objects.create_user(
            email=email, 
            password=password, 
            verified=False
        )
    except IntegrityError:
        return Response({
            'code': RegisterResponseCode.ALREADY_REGISTERED.value
            },
            status=HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response({
        'code': RegisterResponseCode.SUCCESS.value
        }, 
        status=HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([AllowAny])
def register_batch_students(request):
    students = request.data.get("students")
    error_messages = []

    for student in students:
        if not student['email']:
            error_messages.append("The email wasn't provided")
        
        try:
            User.objects.create_user(
                email=student['email'],
                password='Password@123',
                first_name=student['first_name'],
                last_name=student['last_name']
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
        
        student = Student.objects.get(user=user)
        
        Grade.objects.create(
            student=student,
            grade=student['current_grade'],
            year=student['current_year']
        )

    return Response(
        {
            'message': 'Accounts created successfully',
            'error_messages': error_messages
        },
        status=HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([AllowAny])
def register_batch_teachers(request):
    teachers = request.data.get("teachers")
    error_messages = []

    for teacher in teachers:
        if not teacher['email']:
            error_messages.append("The email wasn't provided")
            continue
        try:
            User.objects.create(
                email=teacher['email'],
                password='Password@123',
                first_name=teacher['first_name'],
                last_name=teacher['last_name']
            )
        except IntegrityError:
            error_messages.append("An account with the email {} already exists".format(teacher['email']))
            continue
        
        user = User.objects.get(email=teacher['email'])
        Teacher.objects.create(user=user)

    return Response(
        {
            'message': 'The accounts were created successfully',
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
            'code': 'USER_NOT_FOUND'
        },
        status=HTTP_404_NOT_FOUND
        )
    
    student = Student.objects.get(user=user)

    if not student:
        return Response({
            'code': 'STUDENT_NOT_FOUND'
        },
        status=HTTP_404_NOT_FOUND
        )

    student_serializer = StudentDataSerializer(student)

    return Response({
            'code': 'SUCCESS',
            'student_data': student_serializer.data
        },
        status=HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([IsStudent])
def get_teacher_data():
    pass


@api_view(["PUT"])
@permission_classes((AllowAny))
def update_information(request):
    role = request.data.get("role")
    email = request.data.get("email")
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    user = User.objects.get(email=email)
    user.first_name = first_name
    user.last_name = last_name
    user.verified = True
    user.save()
    if role == Role.STUDENT:
        domain = request.data.get("domain")
        learning_mode = request.data.get("learning_mode")
        degree = request.data.get("degree")
        study_program = request.data.get("study_program")
        current_group = request.data.get("current_group")
        current_year = request.data.get("current_year")
        Student.objects.create(
            user.id, 
            domain=domain, 
            learning_mode=learning_mode,
            degree=degree,
            study_program=study_program,
            current_group=current_group,
            current_year=current_year
        )
    if role == Role.TEACHER:
        Teacher.objects.create(
            user=user
        )

    return Response(
        {'message': 'Data updated successfuly'}, 
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
