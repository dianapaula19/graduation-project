from django.db import models

# Create your models here.
class Course(models.Model):
    teacher = models.ForeignKey('users.Teacher', related_name='courses', on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=255)
    link = models.URLField(max_length=200)
    