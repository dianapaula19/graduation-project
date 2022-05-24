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
from users.models import Student, Teacher, User
from backend.permissions import IsStudent, IsTokenAuthentificated

# Create your views here.

@api_view(["POST"])
@permission_classes([AllowAny])
def get_courses_teacher(request):
    
    email = request.data.get("email")
    user = User.objects.get(email=email)
    
    if user is None:
        return Response({
            'error': 'User not found'},
            status=HTTP_404_NOT_FOUND
        )

    teacher = Teacher.objects.get(user=user)

    if teacher is None:
        return Response({
            'error': 'Teacher not found'
        },
        status=HTTP_404_NOT_FOUND
        )
    
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
    title = request.data.get('title')
    domain = request.data.get('domain')
    learning_mode = request.data.get('learning_mode')
    study_program = request.data.get('study_program')
    degree = request.data.get('degree')
    year = request.data.get('year')
    semester = request.data.get('semester')

    try:
        OptionsList.objects.get_or_create(
            domain=domain,
            learning_mode=learning_mode,
            study_program=study_program,
            degree=degree,
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
    email = request.data.get('email')
    choices = request.data.get('choices')

    user = User.objects.get(email=email)
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
        try:
            StudentOptionChoice.objects.update_or_create(
                student=student,
                options_list=options_list,
                course=course,
                order=order
            )
        except:
            return Response({
                'error': "Internal Server Error"
            },
            status=HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response({
        'message': "Student's choices created/updated successfully"
    },
    status=HTTP_200_OK
    )
    

@api_view(["GET"])
@permission_classes([AllowAny])
def get_student_choices(request):
    user_id = request.data.get('user_id')
    options_list_id = request.data.get('options_list_id')

    user = User.objects.get(id=user_id)
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

    data = StudentOptionChoice.objects.filter(
        options_list=options_list,
        student=student
    ).order_by('order').all()

    if data is None:
        return Response({
            'error': "No choices were found"
        },
        status=HTTP_404_NOT_FOUND
        )

    res = serializers.serialize('json', data)

    return Response( 
        res,
        status=HTTP_200_OK)
