from courses.serializers import CourseSerializer
from courses.models import Course
from .models import Grade, Teacher, User, Student
from rest_framework import serializers

class UserDataSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ['email', 'first_name', 'last_name', 'role']

class GradeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Grade
    fields = ['grade', 'year']

class StudentDataSerializer(serializers.ModelSerializer):

  email = serializers.CharField(source='user.email')
  first_name = serializers.CharField(source='user.first_name')
  last_name = serializers.CharField(source='user.last_name')

  grades = serializers.SerializerMethodField()

  def get_grades(self, obj):
    grades_query = Grade.objects.filter(student=obj).order_by('year')
    serializer = GradeSerializer(grades_query, many=True)
    
    return serializer.data

  class Meta:
    model = Student
    fields = ['email', 'first_name', 'last_name', 'domain', 'learning_mode', 'degree', 'study_program', 'current_group', 'current_year', 'grades']

class TeacherDataSerializer(serializers.ModelSerializer):

  email = serializers.CharField(source='user.email')
  first_name = serializers.CharField(source='user.first_name')
  last_name = serializers.CharField(source='user.last_name')
  courses = serializers.SerializerMethodField()

  def get_courses(self, obj):
    courses_query = Course.objects.filter(teacher=obj)
    serializers = CourseSerializer(courses_query, many=True)

    return serializers.data
  class Meta:
    model = Teacher
    fields = ['email', 'first_name', 'last_name', 'courses']