from django.shortcuts import render

# Create your views here.
from django.contrib.auth import authenticate
from .models import User, Student, Teacher
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK
)
from rest_framework.response import Response
from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
import os


@api_view(["POST"])
@permission_classes((AllowAny,))
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
    
    token, _ = Token.objects.get_or_create(user=user)
    
    return Response({'token': token.key},
                    status=HTTP_200_OK)

@api_view(["POST"])
@permission_classes((AllowAny))
def register(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if email is None or password is None:
        return Response({'error': 'Please provide both email and password'},
                        status=HTTP_400_BAD_REQUEST)

    User.objects.create_user(email=email, password=password, verified=False)

    return Response({'msg': 'Your account was created succesfully. Once your account is verified, you will be notified by email'}, status=HTTP_200_OK)

@api_view(["PUT"])
@permission_classes((AllowAny))
def update_information(request):
    role = request.data.get("role")
    email = request.data.get("email")
    first_name = request.data.get("first_name")
    last_name = request.data.get("last_name")
    u = User.objects.get(email=email)
    u.first_name = first_name
    u.last_name = last_name
    u.verified = True
    u.save()
    if role == 'STUDENT':
        domain = request.data.get("domain")
        learning_mode = request.data.get("learning_mode")
        degree = request.data.get("degree")
        study_program = request.data.get("study_program")
        current_group = request.data.get("current_group")
        current_year = request.data.get("current_year")
        Student.objects.create(
            u.id, 
            domain=domain, 
            learning_mode=learning_mode,
            degree=degree,
            study_program=study_program,
            current_group=current_group,
            current_year=current_year
        )
    if role == "TEACHER":
        Teacher.objects.create(
            u.id
        )

    return Response(
        {'msg': 'Data updated successfuly'}, 
        status=HTTP_200_OK
    )    


@api_view(["POST"])
@permission_classes((AllowAny))
def create_students_accounts(request):
    file = request.data.get('file')
    os.system('python3 ../utils/create_students_accounts.py ' + file)
    return Response(status=HTTP_200_OK)


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
