from courses.models import OptionsList
from .models import Grade, User, Student
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'role']

class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ['grade', 'year']

class StudentSerializer(serializers.ModelSerializer):

    grades = serializers.SerializerMethodField()
    options_lists = serializers.SerializerMethodField()

    def get_grades(self, obj):
        grades_query = Grade.objects.filter(student=obj)
        serializer = GradeSerializer(grades_query, many=True)
        
        return serializer.data
    
    def get_options_lists(self, obj):
        options_lists_query = OptionsList.objects.filter(student=obj)
    class Meta:
        model = Student
        fields = ['domain', 'learning_mode', 'degree', 'study_program', 'current_group', 'current_year', 'current_semester', 'grades']