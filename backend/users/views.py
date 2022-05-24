from email.headerregistry import Group
from nis import cat
from django.db import IntegrityError
from django.shortcuts import render

# Create your views here.
from django.contrib.auth import authenticate
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


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    
    if email is None or password is None:
        return Response({'error': 'Please provide both email and password'},
                        status=HTTP_400_BAD_REQUEST)

    user = authenticate(email=email, password=password)
    
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)

    if user.verified == False:
        return Response({
            'error': "Your account wasn`t verified yet. You will receive an email as soon as your account is verified."
        },
        status=HTTP_403_FORBIDDEN
        )

    token, _ = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'email': user.email,
        'message': 'Succesful login' 
        },
        status=HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([AllowAny])
def logout(request):
    key = request.META.get('HTTP_AUTHORIZATION')[7:]
    Token.objects.filter(key=key).delete()

    return Response({
            'message': 'Successful logout'    
        },
        status=HTTP_200_OK
    )
    
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if email is None or password is None:
        return Response({'error': 'Please provide both email and password'},
                        status=HTTP_400_BAD_REQUEST)

    try:
        User.objects.create_user(
            email=email, 
            password=password, 
            verified=False
        )
    except IntegrityError:
        return Response(
            {'error': "You are already registered"},
            status=HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response({
        'message': 'Your account was created succesfully. Once your account is verified, you will be notified by email'}, 
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
    teachers = request.data.get("teacher")
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
