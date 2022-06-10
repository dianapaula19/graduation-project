from rest_framework import serializers
from .models import Course, OptionsList, StudentOptionChoice

class OptionsListCourseSerializer(serializers.ModelSerializer):
	class Meta:
		model = Course
		fields = ['id']

class OptionsListSerializer(serializers.ModelSerializer):
	courses_ids = OptionsListCourseSerializer(many=True)
	class Meta:
		model = OptionsList
		fields = ['id', 'domain', 'learning_mode', 'degree', 'study_program', 'year', 'semester', 'title', 'courses_ids']

class CourseSerializer(serializers.ModelSerializer):
	teacher_first_name = serializers.CharField(source='teacher.user.first_name')
	teacher_last_name = serializers.CharField(source='teacher.user.last_name')
	teacher_email = serializers.CharField(source='teacher.user.email')
	class Meta:
		model = Course
		fields = ['title', 'link', 'capacity', 'teacher_first_name', 'teacher_last_name', 'teacher_email', 'teacher_id']

class StudentOptionsListSerializer(serializers.ModelSerializer):
	courses = CourseSerializer(many=True)
	class Meta:
		model = OptionsList
		fields = ['id', 'title', 'semester', 'courses']

class StudentOptionChoiceSerializer(serializers.ModelSerializer):
	class Meta:
		model = StudentOptionChoice
		fields = ['options_list', 'course', 'order']
		