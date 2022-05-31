from courses.serializers import OptionsListSerializer, StudentOptionChoiceSerializer, StudentOptionsListSerializer
from courses.models import OptionsList, StudentOptionChoice
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

class StudentDataSerializer(serializers.ModelSerializer):

    grades = serializers.SerializerMethodField()

    def get_grades(self, obj):
        grades_query = Grade.objects.filter(student=obj).order_by('grade')
        serializer = GradeSerializer(grades_query, many=True)
        
        return serializer.data

    class Meta:
        model = Student
        fields = ['domain', 'learning_mode', 'degree', 'study_program', 'current_group', 'current_year', 'current_semester', 'grades']