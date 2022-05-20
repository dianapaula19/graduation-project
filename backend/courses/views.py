from django.shortcuts import render
from django.core import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK
)
from .models import Course
from users.models import Teacher, User

# Create your views here.

@api_view(["GET"])
@permission_classes((AllowAny,))
def get_courses_teacher(request):
    email = request.data.get("email")
    user = User.objects.get(email=email)
    teacher = Teacher.objects.get(user_id=user.id)

    if teacher is None:
        return Response({'error': 'Teacher not found'},
                        status=HTTP_404_NOT_FOUND)
    
    data = serializers.serialize('json', teacher.courses.all())
    
    return Response( 
        data,
        status=HTTP_200_OK)