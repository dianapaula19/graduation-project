"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
  https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
  1. Add an import:  from my_app import views
  2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
  1. Add an import:  from other_app.views import Home
  2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
  1. Import the include() function: from django.urls import include, path
  2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from users.views import login, \
            register, \
            register_batch_students, \
            register_batch_teachers, \
            get_student_data, \
            not_verified_users, \
            students, \
            teachers, \
            send_announcement, \
            update_selection_session_open
from courses.views import create_or_uptate_student_choices, \
              create_course, \
              update_course, \
              create_options_list, \
              update_options_list, \
              get_student_options_lists, \
              get_options_lists, \
              get_courses, \
              get_teacher_courses, \
              get_student_courses

urlpatterns = [
  path('admin/', admin.site.urls),
  
  # users urls
  path('api/user/login', login),
  path('api/user/register', register),
  path('api/user/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
  
  # student
  path('api/user/student/data', get_student_data),
  
  # admin
  path('api/user/admin/register_batch_students', register_batch_students),
  path('api/user/admin/register_batch_teachers', register_batch_teachers),
  path('api/user/admin/not_verified_users', not_verified_users),
  path('api/user/admin/students', students),
  path('api/user/admin/teachers', teachers),
  path('api/user/admin/update_selection_session_open', update_selection_session_open),

  # teacher
  path('api/user/teacher/send_announcement', send_announcement),
   
  # courses urls
  # student
  path('api/course/student/create_or_update_student_choices', create_or_uptate_student_choices),
  path('api/course/student/get_student_options_lists', get_student_options_lists),
  path('api/course/student/get_student_course', get_student_courses),
  
  # admin
  path('api/course/admin/get_courses', get_courses),
  path('api/course/admin/create_course', create_course),
  path('api/course/admin/update_course', update_course),
  path('api/course/admin/get_options_lists', get_options_lists),
  path('api/course/admin/create_options_list', create_options_list),
  path('api/course/admin/update_options_list', update_options_list),
  
  # teacher
  path('api/course/teacher/get_teacher_courses', get_teacher_courses),
]
