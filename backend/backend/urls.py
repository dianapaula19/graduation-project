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
from users.views import login, register, update_information
from courses.views import get_courses_teacher

urlpatterns = [
    path('admin', admin.site.urls),
    path('api/login', login),
    path('api/register', register),
    path('api/update', update_information),
    path('api/teacher_courses', get_courses_teacher),
    path('api/password_reset', include('django_rest_passwordreset.urls', namespace='password_reset'))
]
