from django.db import IntegrityError
from django.core import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from .models import Course, OptionsList, StudentOptionChoice
from users.models import Student, Teacher, User, Category

# Create your views here.

@api_view(["GET"])
@permission_classes([AllowAny])
def get_courses_teacher(request):
    
    email = request.data.get("email")
    user = User.objects.get(email=email)
    
    if user is None:
        return Response({'error': 'Teacher not found'},
                        status=HTTP_404_NOT_FOUND)

    teacher = Teacher.objects.get(user=user)
    
    data = serializers.serialize('json', teacher.courses.all())
    
    return Response( 
        data,
        status=HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_course(request):
    
    course = request.data.get("course")
    
    try:
        Course.objects.create(
            title=course['title'],
            link=course['link'],
            capacity=course['capacity']
        )
    except IntegrityError:
        return Response(
            {'error': 'The course already exists'},
            status=HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    return Response(
        {'message': 'Course created succesfully'},
        status=HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([AllowAny])
def create_options_list(request):
    category_id = request.data.get('category_id')
    title = request.data.get('title')
    year = request.data.get('year')
    semester = request.data.get('semester')

    category = Category.objects.get(id=category_id)

    if category is None:
        return Response({
            'error': "The category doesn't not exist"
        },
        status=HTTP_404_NOT_FOUND
        )

    try:
        OptionsList.objects.create(
            category=category,
            title=title,
            year=year,
            semester=semester            
        )
    except:
        return Response({
            'error': "Internal Server Error"
        },
        status=HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response({
        'message': 'The options list was create successfully'
    },
    status=HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([AllowAny])
def add_course_to_options_list(request):
    course_id = request.data.get('course_id')
    options_list_id = request.data.get('options_list_id')

    course = Course.objects.get(id=course_id)
    if course is None:
        return Response({
            'error': "The course doesn't exist"
        },
        status=HTTP_404_NOT_FOUND
        )

    options_list = OptionsList.objects.get(id=options_list_id)
    if options_list is None:
        return Response({
            'error': "The options list doesn't exist"
        },
        status=HTTP_404_NOT_FOUND
        )

    try:
        options_list.courses.add(course)
    except:
        return Response({
            'error': "Internal Server Error"
        },
        status=HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    return Response({
        'message': "The course was added to the options list successfully"
    },
    status=HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([AllowAny])
def create_or_uptate_student_choices(request):
    options_list_id = request.data.get('options_list_id')
    user_id = request.data.get('user_id')
    choices = request.data.get('choices')

    user = Course.objects.get(id=user_id)
    if user is None:
        return Response({
            'error': "The user doesn't exist"
        },
        status=HTTP_404_NOT_FOUND
        )

    student = Student.objects.get(user=user)

    if student is None:
        return Response({
            'error': "The student doesn't exist"
        },
        status=HTTP_404_NOT_FOUND
        )

    options_list = OptionsList.objects.get(id=options_list_id)
    if options_list is None:
        return Response({
            'error': "The options list doesn't exist"
        },
        status=HTTP_404_NOT_FOUND
        )

    for choice in choices:
        course_id = choice['course_id']
        order = choice['order']

        course = Course.objects.get(id=course_id)
        if course is None:
            return Response({
                'error': "The course doesn't exist"
            },
            status=HTTP_404_NOT_FOUND
            )
        StudentOptionChoice.objects.update_or_create(
            student=student,
            options_list=options_list,
            course=course,
            order=order
        )

