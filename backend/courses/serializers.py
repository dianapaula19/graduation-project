from rest_framework import serializers
from .models import Course, OptionsList, StudentOptionChoice

class OptionsListSerializer(serializers.ModelSerializer):
	class Meta:
		model = OptionsList
		fields = ['id', 'domain', 'learning_mode', 'degree', 'study_program', 'year', 'semester', 'title']

class StudentCourseSerializer(serializers.ModelSerializer):
	teacher_first_name = serializers.CharField(source='teacher.user.first_name')
	teacher_last_name = serializers.CharField(source='teacher.user.last_name')
	teacher_email = serializers.CharField(source='teacher.user.email')
	class Meta:
		model = Course
		fields = ['id', 'title', 'link', 'capacity', 'teacher_first_name', 'teacher_last_name', 'teacher_email']

class StudentOptionsListSerializer(serializers.ModelSerializer):
	courses = StudentCourseSerializer(many=True)
	class Meta:
		model = OptionsList
		fields = ['id', 'title', 'courses']

class StudentOptionChoiceSerializer(serializers.ModelSerializer):
	class Meta:
		model = StudentOptionChoice
		fields = ['options_list', 'course', 'order']
		