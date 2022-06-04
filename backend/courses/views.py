from enum import Enum
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

from .serializers import CourseSerializer, StudentCourseSerializer, StudentOptionChoiceSerializer, StudentOptionsListSerializer

from .models import Course, OptionsList, StudentOptionChoice
from users.models import Student, Teacher, User
from backend.permissions import IsStudent, IsTokenAuthentificated


class ResponseCode(Enum):
    USER_NOT_FOUND = 'USER_NOT_FOUND'
    STUDENT_NOT_FOUND = 'STUDENT_NOT_FOUND'
    TEACHER_NOT_FOUND = 'TEACHER_NOT_FOUND'
    OPTIONS_LIST_NOT_FOUND = 'OPTIONS_LIST_NOT_FOUND'
    COURSE_NOT_FOUND = 'COURSE_NOT_FOUND'
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR'
    SUCCESS = 'SUCCESS'

# Create your views here.

@api_view(["POST"])
@permission_classes([AllowAny])
def create_or_uptate_student_choices(request):
    options_list_id = request.data.get('options_list_id')
    email = request.data.get('email')
    choices = request.data.get('choices')

    user = User.objects.get(email=email)
    if user is None:
        return Response({
            'code': ResponseCode.USER_NOT_FOUND.value
        },
        status=HTTP_404_NOT_FOUND
        )

    student = Student.objects.get(user=user)

    if student is None:
        return Response({
            'code': ResponseCode.STUDENT_NOT_FOUND.value
        },
        status=HTTP_404_NOT_FOUND
        )

    options_list = OptionsList.objects.get(id=options_list_id)
    
    if options_list is None:
        return Response({
            'code': ResponseCode.OPTIONS_LIST_NOT_FOUND.value
        },
        status=HTTP_404_NOT_FOUND
        )

    for choice in choices:
        course_id = choice['course_id']
        order = choice['order']

        course = Course.objects.get(id=course_id)
        if course is None:
            return Response({
                'code': ResponseCode.COURSE_NOT_FOUND.value
            },
            status=HTTP_404_NOT_FOUND
            )
        
        try:
            obj, created = StudentOptionChoice.objects.update_or_create(
                student=student, 
                course=course,
                options_list=options_list,
                defaults={'order': order},
            )
        except:
            return Response({
                'code': ResponseCode.INTERNAL_SERVER_ERROR.value
                },
            status=HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response({
        'code': ResponseCode.SUCCESS.value
        },
        status=HTTP_200_OK
    )
    

@api_view(["POST"])
@permission_classes([AllowAny])
def get_student_options_lists(request):
    user_email = request.data.get('email')

    user = User.objects.get(email=user_email)

    if user is None:
        return Response({
            'code': ResponseCode.USER_NOT_FOUND.value
        },
        status=HTTP_404_NOT_FOUND
        )

    student = Student.objects.get(user=user)

    if student is None:
        return Response({
            'code': ResponseCode.STUDENT_NOT_FOUND.value
        },
        status=HTTP_404_NOT_FOUND
        )

    res = []
    for options_list in student.options_lists.all():
        choices = []
        try:
            choices = StudentOptionChoice.objects.choices_sorted_by_order(student=student, options_list=options_list)
        except:
            choices = []

        reordered_courses = []

        for choice in choices:
            reordered_courses.append(StudentCourseSerializer(choice.course).data)

        res.append({
            'id': options_list.id,
            'title': options_list.title,
            'courses': reordered_courses if len(choices) != 0 else StudentCourseSerializer(options_list.courses, many=True).data
        })
    

    return Response({
        'student_options_lists': res
        },
        status=HTTP_200_OK
    )

@api_view(["POST"])
@permission_classes([AllowAny])
def create_options_list(request):
    domain = request.data.get("domain")
    learning_mode = request.data.get("learning_mode")
    degree = request.data.get("degree")
    study_program = request.data.get("study_program")
    title = request.data.get("title")
    year = request.data.get("year")
    semester = request.data.get("semester")
    courses = request.data.get("courses")

    try:
        OptionsList.objects.create(
            domain=domain,
            learning_mode=learning_mode,
            degree=degree,
            study_program=study_program,
            title=title,
            year=year,
            semester=semester
        )
    except:
        return Response({
            'code': ResponseCode.INTERNAL_SERVER_ERROR
        },
            status=HTTP_500_INTERNAL_SERVER_ERROR
        )

    check_semester = 1 if semester == 2 else 2
    check_year = year - 1 

    options_list = OptionsList.objects.get(
        domain=domain,
        learning_mode=learning_mode,
        degree=degree,
        study_program=study_program,
        title=title,
        year=year,
        semester=semester
    )

    for student in Student.objects.all().iterator():
        if student.domain == domain \
            and student.learning_mode == learning_mode \
            and student.degree == degree \
            and student.study_program == study_program \
            and student.current_semester == check_semester \
            and student.current_year == check_year:
            if student not in options_list.students:
                options_list.students.add(student)
    
    for course in courses:
        course_obj = Course.objects.get(id=course.id)
        options_list.courses.add(course_obj)

    return Response({
        'code': ResponseCode.SUCCESS.value
    },
    status=HTTP_200_OK
    )

@api_view(["GET"])
@permission_classes([AllowAny])
def get_courses(request):
    courses = Course.objects.all()

    return Response({
        'courses': CourseSerializer(courses, many=True).data
        },
        status=HTTP_200_OK
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def get_courses_teacher(request):
    
    email = request.data.get("email")
    user = User.objects.get(email=email)
    
    if user is None:
        return Response({
            'code': 'User not found'},
            status=HTTP_404_NOT_FOUND
        )

    teacher = Teacher.objects.get(user=user)

    if teacher is None:
        return Response({
            'code': 'Teacher not found'
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
            {'code': 'The course already exists'},
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
