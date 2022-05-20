from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.
class Course(models.Model):
    teacher = models.ForeignKey('users.Teacher', related_name='courses', on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=255)
    link = models.URLField(max_length=200)
    capacity = models.IntegerField(default=0, validators=[MinValueValidator(1), MaxValueValidator(100)])

class OptionsList(models.Model):
    group_id = models.ForeignKey('users.Group', on_delete=models.CASCADE)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)