from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from users.models import Degree, Domain, LearningMode, StudyProgram

# Create your models here.
class Course(models.Model):
    teacher = models.ForeignKey('users.Teacher', related_name='courses', on_delete=models.SET_NULL, null=True)
    students = models.ManyToManyField('users.Student', related_name='enrolled_students')
    title = models.CharField(max_length=255)
    link = models.URLField(max_length=200, null=True)
    capacity = models.IntegerField(default=0, validators=[MinValueValidator(1), MaxValueValidator(100)])

class OptionsListManager(models.Manager):
    def get_students_sorted_by_grade(self, options_list):
        students = list(super().get_queryset().filter(id=options_list.id)[0].students.all())
        students.sort(key= lambda s: s.grades.get_student_current_grade(s), reverse=True)
        return students

class OptionsList(models.Model):
    courses = models.ManyToManyField('Course', related_name='courses')
    students = models.ManyToManyField('users.Student', related_name='students')
    domain = models.TextField(choices=Domain.choices, null=True)
    learning_mode = models.TextField(choices=LearningMode.choices, null=True)
    degree = models.TextField(choices=Degree.choices, null=True)
    study_program = models.TextField(choices=StudyProgram.choices, null=True)
    title = models.CharField(max_length=255)
    year = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(4)
        ],
        default=1
    )
    semester = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(2)
        ],
        default=1
    )

    objects = OptionsListManager()
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['domain', 'learning_mode', 'degree', 'study_program', 'year', 'semester', 'title'], name='unique_migration_options_list'
            ),
        ]

class StudentOptionChoiceManager(models.Manager):
    def choices_sorted_by_order(self, student, options_list):
        return super().get_queryset().filter(options_list=options_list, student=student).order_by('order').all()

class StudentOptionChoice(models.Model):
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    options_list = models.ForeignKey('OptionsList', on_delete=models.CASCADE)
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    order = models.IntegerField(
        validators=[
            MinValueValidator(0)
        ]
    )

    objects = StudentOptionChoiceManager()
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'options_list', 'course'], name='unique_migration_student_options_list_course'
            ),
        ]
