from rest_framework import serializers
from .models import Course, OptionsList, StudentOptionChoice

class OptionsListSerializer(serializers.ModelSerializer):
	class Meta:
		model = OptionsList
		fields = ['id', 'domain', 'learning_mode', 'degree', 'study_program', 'year', 'semester', 'title']

class StudentCourseSerializer(serializers.ModelSerializer):

	class Meta:
		model = Course
		fields = ['id', 'title', 'link']

class StudentOptionsListSerializer(serializers.ModelSerializer):
	courses = StudentCourseSerializer(many=True)
	class Meta:
		model = OptionsList
		fields = ['id', 'title', 'courses']

class StudentOptionChoiceSerializer(serializers.ModelSerializer):

	class Meta:
		model = StudentOptionChoice
		fields = ['id', 'options_list', 'course', 'order']
		