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

from .serializers import CourseSerializer, OptionsListSerializer, TeacherCourseSerializer

from .models import Course, OptionsList, StudentOptionChoice
from users.models import Student, Teacher, User
from backend.permissions import IsAdmin, IsStudent, IsTeacher, IsTokenAuthentificated


class ResponseCode(Enum):
  USER_NOT_FOUND = 'USER_NOT_FOUND'
  STUDENT_NOT_FOUND = 'STUDENT_NOT_FOUND'
  TEACHER_NOT_FOUND = 'TEACHER_NOT_FOUND'
  OPTIONS_LIST_NOT_FOUND = 'OPTIONS_LIST_NOT_FOUND'
  COURSE_NOT_FOUND = 'COURSE_NOT_FOUND'
  COURSE_ALREADY_EXIST = 'COURSE_ALREADY_EXISTS'
  ERROR = 'ERROR'
  SUCCESS = 'SUCCESS'

# Create your views here.

# STUDENT Views

@api_view(["POST"])
@permission_classes([IsStudent])
def create_or_update_student_choices(request):
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
        'code': ResponseCode.ERROR.value
        },
      status=HTTP_500_INTERNAL_SERVER_ERROR
      )
  
  return Response({
    'code': ResponseCode.SUCCESS.value
    },
    status=HTTP_200_OK
  )
  

@api_view(["POST"])
@permission_classes([IsStudent])
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
      reordered_courses.append(CourseSerializer(choice.course).data)

    res.append({
      'id': options_list.id,
      'title': options_list.title,
      'semester': options_list.semester,
      'courses': reordered_courses if len(choices) != 0 else CourseSerializer(options_list.courses, many=True).data
    })
  

  return Response({
    'student_options_lists': res,
    'code': ResponseCode.SUCCESS.value
    },
    status=HTTP_200_OK
  )

@api_view(["POST"])
@permission_classes([IsStudent])
def get_student_courses(request):
	user_email = request.data.get('email')
	
	try:
		user = User.objects.get(email=user_email)
	except User.DoesNotExist:
		return Response({
      'code': ResponseCode.USER_NOT_FOUND.value
    },
    status=HTTP_404_NOT_FOUND
    )
	
	try:
		student = Student.objects.get(user=user)
	except Student.DoesNotExist:
		return Response({
			'code': ResponseCode.STUDENT_NOT_FOUND.value
		},
		status=HTTP_404_NOT_FOUND
		)

	return Response({
		'courses': CourseSerializer(student.courses.all(), many=True).data,
		'code': ResponseCode.SUCCESS.value
		},
		status=HTTP_200_OK
	)

# Admin Views

@api_view(["GET"])
@permission_classes([IsAdmin])
def get_options_lists(request):
  options_lists = OptionsList.objects.all()
  serializer = OptionsListSerializer(options_lists, many=True)
  return Response({
    'options_lists': serializer.data,
    'code': ResponseCode.SUCCESS.value
    },
    status=HTTP_200_OK
  )

@api_view(["POST"])
@permission_classes([IsAdmin])
def create_options_list(request):
  
  domain = request.data.get("domain")
  learning_mode = request.data.get("learning_mode")
  degree = request.data.get("degree")
  study_program = request.data.get("study_program")
  title = request.data.get("title")
  year = request.data.get("year")
  semester = request.data.get("semester")
  courses_ids = request.data.get("courses_ids")

  try:
    obj = OptionsList.objects.create(
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
      'code': ResponseCode.ERROR.value
    },
      status=HTTP_500_INTERNAL_SERVER_ERROR
    )
 
  try:
    options_list = OptionsList.objects.get(id=obj.id)
  except OptionsList.DoesNotExist:
    return Response({
      'code': ResponseCode.OPTIONS_LIST_NOT_FOUND.value
    },
      status=HTTP_500_INTERNAL_SERVER_ERROR
    )

  check_year = int(year) - 1
  students = []
  courses = []

  for student in Student.objects.all().iterator():
    if student.domain == domain \
      and student.learning_mode == learning_mode \
      and student.degree == degree \
      and student.study_program == study_program \
      and student.current_year == check_year:
        students.append(student)
        student.options_list.add(options_list)
    else:
      student.options_list.remove(options_list)
    student.save()
  
  for course_id in courses_ids:
    course = Course.objects.get(id=course_id)
    courses.append(course)

  options_list.students.set(students)
  options_list.courses.set(courses)
  options_list.save()

  return Response({
    'code': ResponseCode.SUCCESS.value
    },
    status=HTTP_200_OK
  )

@api_view(["POST"])
@permission_classes([IsAdmin])
def update_options_list(request):
  id = request.data.get("id")
  domain = request.data.get("domain")
  learning_mode = request.data.get("learning_mode")
  degree = request.data.get("degree")
  study_program = request.data.get("study_program")
  title = request.data.get("title")
  year = request.data.get("year")
  semester = request.data.get("semester")
  courses_ids = request.data.get("courses_ids") 
  
  try: 
    options_list = OptionsList.objects.get(id=id)
  except OptionsList.DoesNotExist:
    return Response({
      'code': ResponseCode.OPTIONS_LIST_NOT_FOUND.value
    },
      status=HTTP_404_NOT_FOUND
    )
  
  options_list.domain = domain
  options_list.learning_mode = learning_mode
  options_list.degree = degree
  options_list.study_program = study_program
  options_list.title = title
  options_list.year = year
  options_list.semester = semester

  check_year = int(year) - 1

  students = []
  courses = []

  for student in Student.objects.all().iterator():
    if student.domain == domain \
      and student.learning_mode == learning_mode \
      and student.degree == degree \
      and student.study_program == study_program \
      and student.current_year == check_year:
        students.append(student)
        student.options_lists.add(options_list)
    else:
      student.options_lists.remove(options_list)
    
    student.save()
  
  for course_id in courses_ids:
    course = Course.objects.get(id=course_id)
    courses.append(course)

  options_list.students.set(students)
  options_list.courses.set(courses)
  options_list.save()

  return Response({
    'code': ResponseCode.SUCCESS.value
    },
    status=HTTP_200_OK
  )

@api_view(["POST"])
@permission_classes([IsAdmin])
def delete_options_list(request):
  id = request.data.get("id")
  try:
    OptionsList.objects.filter(id=id).delete()
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
def get_courses(request):
  courses = Course.objects.all()

  return Response({
    'courses': CourseSerializer(courses, many=True).data
    },
    status=HTTP_200_OK
  )

@api_view(["POST"])
@permission_classes([AllowAny])
def create_course(request):
  
  title = request.data.get("title")
  link = request.data.get("link")
  capacity = request.data.get("capacity")
  semester = request.data.get("semester")
  teacher_email = request.data.get("teacher_email")

  try: 
    user = User.objects.get(email=teacher_email)
  except User.DoesNotExist:
    return Response({
      'code': ResponseCode.USER_NOT_FOUND.value
      },
      status=HTTP_404_NOT_FOUND
    )

  try:
    teacher = Teacher.objects.get(user=user)
  except Teacher.DoesNotExist:
    return Response({
      'code': ResponseCode.TEACHER_NOT_FOUND.value
      },
      status=HTTP_404_NOT_FOUND
    )
  
  try:
    Course.objects.create(
      title=title,
      link=link,
      capacity=capacity,
      semester=semester,
      teacher=teacher
    )
  except IntegrityError:
    return Response({
      'code': ResponseCode.COURSE_ALREADY_EXIST.value
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
def update_course(request):
  
  id = request.data.get("id")
  title = request.data.get("title")
  link = request.data.get("link")
  capacity = request.data.get("capacity")
  semester = request.data.get("semester")
  teacher_email = request.data.get("teacher_email")

  try: 
    user = User.objects.get(email=teacher_email)
  except User.DoesNotExist:
    return Response({
      'code': ResponseCode.USER_NOT_FOUND.value
      },
      status=HTTP_404_NOT_FOUND
    )

  try:
    teacher = Teacher.objects.get(user=user)
  except Teacher.DoesNotExist:
    return Response({
      'code': ResponseCode.TEACHER_NOT_FOUND.value
      },
      status=HTTP_404_NOT_FOUND
    )
  
  try:
    Course.objects.filter(id=id).update(
      title=title,
      link=link,
      capacity=capacity,
      semester=semester,
      teacher=teacher
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

@api_view(["POST"])
@permission_classes([IsAdmin])
def delete_course(request):
  id = request.data.get("id")
  try:
    Course.objects.filter(id=id).delete()
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


# Teacher Views
@api_view(["POST"])
@permission_classes([IsTeacher])
def get_teacher_courses(request):
  
  email = request.data.get("email")

  try:
    user = User.objects.get(email=email)
  except User.DoesNotExist:
    return Response({
      'code': ResponseCode.USER_NOT_FOUND.value
      },
      status=HTTP_404_NOT_FOUND
    )
  
  try:
    teacher = Teacher.objects.get(user=user)
  except Teacher.DoesNotExist:
    return Response({
      'code': ResponseCode.TEACHER_NOT_FOUND.value
    },
    status=HTTP_404_NOT_FOUND
    )
  
  serializer = TeacherCourseSerializer(teacher.courses.all(), many=True)
  
  return Response({
      'courses': serializer.data,
      'code': ResponseCode.SUCCESS.value
    },
    status=HTTP_200_OK
  )

