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
from users.views import login, register, logout, update_information, register_batch_students, register_batch_teachers
from courses.views import create_or_uptate_student_choices, get_courses_teacher, create_course, create_options_list, add_course_to_options_list, get_student_choices

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/login', login),
    path('api/user/register', register),
    path('api/user/logout', logout),
    path('api/user/register_batch_students', register_batch_students),
    path('api/user/register_batch_teachers', register_batch_teachers),
    path('api/course/create_course', create_course),
    path('api/course/teacher_courses', get_courses_teacher),
    path('api/course/create_course', create_course),
    path('api/course/create_options_list', create_options_list),
    path('api/course/add_course_to_options_list', add_course_to_options_list),
    path('api/course/create_or_update_student_choices', create_or_uptate_student_choices),
    path('api/course/get_student_choices', get_student_choices),
    path('api/password_reset', include('django_rest_passwordreset.urls', namespace='password_reset'))
]
