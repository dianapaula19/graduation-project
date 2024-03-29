from enum import Enum
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

class Role(models.TextChoices):
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'

class Domain(models.TextChoices):
  INFO = 'INFO',
  CTI = 'CTI',
  MATE = 'MATE'

class LearningMode(models.TextChoices):
  IF = 'IF',
  IFR = 'IFR',
  ID = 'ID'

class Degree(models.TextChoices):
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER'

class StudyProgram(models.TextChoices):
  NLP = 'NLP',
  DS = 'DS',
  SAL = 'SAL',
  AMA = 'AMA',
  SD = 'SD',
  AI = 'AI',
  IS = 'IS',
  BDTS = 'BDTS',
  PSFS = 'PSFS',
  MD = 'MD',
  ASM = 'ASM',
  TI = 'TI',
  INFO = 'INFO',
  MATEINFO = 'MATEINFO',
  MATE = 'MATE',
  MA = 'MA'

class SelectionSessionSettingValue(Enum):
  TRUE = 'TRUE'
  FALSE = 'FALSE'

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
    extra_fields.setdefault('role', Role.ADMIN)

    if extra_fields.get('is_staff') is not True:
      raise ValueError('Superuser must have is_staff=True.')
    if extra_fields.get('is_superuser') is not True:
      raise ValueError('Superuser must have is_superuser=True')
    
    return self.create_user(email, password, **extra_fields)


class StudentManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(role=Role.STUDENT)

class TeacherManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(role=Role.TEACHER)

class NotVerifiedUserManager(models.Manager):
  def get_queryset(self):
    return super().get_queryset().filter(verified=False)

class User(AbstractUser):
  username = None
  email = models.EmailField(unique=True)
  first_name = models.TextField(max_length=50)
  last_name = models.TextField(max_length=50)
  role = models.TextField(choices=Role.choices, null=True)
  verified = models.BooleanField(default=False)
  changed_password = models.BooleanField(default=False)

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = []

  objects = UserManager()
  students = StudentManager()
  teachers = TeacherManager()
  not_verified_users = NotVerifiedUserManager()

  def __str__(self):
    return self.email

  class Meta:
    verbose_name = 'user'
    verbose_name_plural = "users"

class Student(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
  domain = models.TextField(choices=Domain.choices, null=True)
  learning_mode = models.TextField(choices=LearningMode.choices, null=True)
  degree = models.TextField(choices=Degree.choices, null=True)
  study_program = models.TextField(choices=StudyProgram.choices, null=True)
  current_group = models.CharField(max_length=3, null=True)
  current_year = models.IntegerField(
    validators=[
      MinValueValidator(1),
      MaxValueValidator(4)
    ],
    default=1
  )
  options_lists = models.ManyToManyField('courses.OptionsList', related_name='options_lists')
  courses = models.ManyToManyField('courses.Course', related_name='student_courses')

  class Meta:
    verbose_name = 'student'
    verbose_name_plural = "students"

class Teacher(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
  class Meta:
    verbose_name = 'teacher'
    verbose_name_plural = "teachers"
    
class GradeManager(models.Manager):
  def get_student_current_grade(self, student):
    try: 
      grade = super().get_queryset().filter(student=student, year=student.current_year)[0]
      return grade.grade 
    except:
      return 0.0

class Grade(models.Model):
  student = models.ForeignKey(Student, related_name='grades', on_delete=models.CASCADE)
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

  objects = GradeManager()
  class Meta:
    verbose_name = 'grade'
    verbose_name_plural = 'grades'
    constraints = [
      models.UniqueConstraint(
        fields=['student', 'year'], name='unique_migration_grade_student_year'
      ),
    ]

class AppSetting(models.Model):
  key = models.TextField(max_length=50, primary_key=True)
  value = models.TextField(max_length=50)