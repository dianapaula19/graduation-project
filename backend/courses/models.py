from statistics import mode
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class Course(models.Model):
    teacher = models.ForeignKey('users.Teacher', related_name='courses', on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=255, unique=True)
    link = models.URLField(max_length=200, null=True)
    capacity = models.IntegerField(default=0, validators=[MinValueValidator(1), MaxValueValidator(100)])

class OptionsList(models.Model):
    category = models.ForeignKey('users.Category', on_delete=models.CASCADE)
    courses = models.ManyToManyField('Course', related_name='courses')
    title = models.CharField(max_length=255, unique=True)
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

class StudentOptionChoice(models.Model):
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    options_list = models.ForeignKey('OptionsList', on_delete=models.CASCADE)
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    order = models.IntegerField(
        validators=[
            MinValueValidator(0)
        ]
    )
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['student', 'options_list', 'course'], name='unique_migration_student_options_list_course'
            ),
            # models.UniqueConstraint(
            #     fields=['options_list', 'order'], name='unique_migration_options_list_order'
            # )
        ]
