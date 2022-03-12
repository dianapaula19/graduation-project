from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        return self.create_user(email, password, **extra_fields)

class Role(models.Model):
    STUDENT = 1
    TEACHER = 2
    ADMIN = 3
    ROLE_CHOICES = (
        (STUDENT, 'student'),
        (TEACHER, 'teacher'),
        (ADMIN, 'admin')
    )

    id = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, primary_key=True)

    def __str__(self):
        return self.get_id_display()

class User(AbstractUser):

    roles = models.ManyToManyField(Role)

    username = None
    email = models.EmailField('email address', unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

class Domain(models.TextChoices):
    COMPUTER_SCIENCE = 'Computer Science'
    COMPUTER_ENGINEERING = 'Computer Engineering'
    MATHEMATICS = 'Mathematics'

class LearningMode(models.TextChoices):
    IF = 'IF',
    IFR = 'IFR',
    ID = 'ID'

class Degree(models.TextChoices):
    BACHELORS = 'Bachelors',
    MASTERS = 'Masters'


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    domain = models.TextField(choices=Domain.choices)
    learning_mode = models.TextField(choices=LearningMode.choices)
    degree = models.TextField(choices=Degree.choices)
    study_program = models.CharField(max_length=255)
    current_group = models.CharField(max_length=3)
    current_year = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(4)
        ]
    )
    
    def get_current_grade(self):
        return self.grades.all().filter(year=self.current_year)

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def get_courses(self):
        return self.course.all()



class Grade(models.Model):
    student = models.ForeignKey(Student, related_name='grades', on_delete=models.SET_NULL, null=True)
    grade = models.FloatField(
        validators=[
            MinValueValidator(0.0),
            MaxValueValidator(10.0)
        ]
    )
    year = models.IntegerField(
        validators=[
            MinValueValidator(1), 
            MaxValueValidator(4)
        ]
    )