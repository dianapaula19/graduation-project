from rest_framework import serializers

from users.models import Student
from .models import Course, OptionsList, StudentOptionChoice

class OptionsListCourseSerializer(serializers.ModelSerializer):
	class Meta:
		model = Course
		fields = ['id']

class OptionsListSerializer(serializers.ModelSerializer):
	courses = OptionsListCourseSerializer(many=True)
	class Meta:
		model = OptionsList
		fields = ['id', 'domain', 'learning_mode', 'degree', 'study_program', 'year', 'semester', 'title', 'courses']

class CourseSerializer(serializers.ModelSerializer):
	teacher_first_name = serializers.CharField(source='teacher.user.first_name')
	teacher_last_name = serializers.CharField(source='teacher.user.last_name')
	teacher_email = serializers.CharField(source='teacher.user.email')
	class Meta:
		model = Course
		fields = ['id', 'title', 'link', 'capacity', 'semester', 'teacher_first_name', 'teacher_last_name', 'teacher_email']

class StudentSerializer(serializers.ModelSerializer):

  email = serializers.CharField(source='user.email')
  first_name = serializers.CharField(source='user.first_name')
  last_name = serializers.CharField(source='user.last_name')
  
  class Meta:
    model = Student
    fields = ['email', 'first_name', 'last_name']

class TeacherCourseSerializer(serializers.ModelSerializer):

	students = StudentSerializer(many=True)
	class Meta:
		model = Course
		fields = ['id', 'title', 'students']

class StudentOptionsListSerializer(serializers.ModelSerializer):
	courses = CourseSerializer(many=True)
	class Meta:
		model = OptionsList
		fields = ['id', 'title', 'semester', 'courses']

class StudentOptionChoiceSerializer(serializers.ModelSerializer):
	class Meta:
		model = StudentOptionChoice
		fields = ['options_list', 'course', 'order']
		