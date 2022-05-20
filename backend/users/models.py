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

class User(AbstractUser):

    username = None
    email = models.EmailField('email address', unique=True)
    first_name = models.TextField('first name')
    last_name = models.TextField('last name')
    verified = models.BooleanField('verified', default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

class Domain(models.TextChoices):
    INFO = 'Informatică',
    CTI = 'Calculatoare și Tehnologia Informației',
    MATE = 'Matematică'

class LearningMode(models.TextChoices):
    IF = 'Învățământ cu Frecvență',
    IFR = 'Învățământ cu Frecvență Redusă',
    ID = 'Învățământ la Distanță'

class Degree(models.TextChoices):
    LICENTA = 'Licență',
    MASTER = 'Master'

class StudyProgram(models.TextChoices):
    NLP = 'Natural Language Processing',
    DS = 'Data Science',
    SLA = 'Securitate și Logică Aplicată'
    SD = 'Sisteme Distribuite',
    IA = 'Inteligență Artificială',
    IS = 'Inginerie Software',
    BDTS = 'Baze de Date și Tehnologii Software',
    PSFS = 'Probabilități și Statistică în Finanțe și Științe',
    MD = 'Matematică Didactică',
    ASM = 'Advanced Studies in Mathematics',
    TI = 'Tehnlogia Informației',
    INFO = 'Informatică',
    MATEINFO = 'Matematică-Informatică',
    MATE = 'Matematică',
    MA = 'Matematici Aplicate'


class Group(models.Model):
    domain = models.TextField(choices=Domain.choices)
    learning_mode = models.TextField(choices=LearningMode.choices)
    degree = models.TextField(choices=Degree.choices)
    study_program = models.TextField(choices=StudyProgram.choices)
    year = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(4)
        ]
    )

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    domain = models.TextField(choices=Domain.choices)
    learning_mode = models.TextField(choices=LearningMode.choices)
    degree = models.TextField(choices=Degree.choices)
    study_program = models.TextField(choices=StudyProgram.choices)
    current_group = models.CharField(max_length=3)
    current_year = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(4)
        ]
    )

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)


class Grade(models.Model):
    student = models.ForeignKey(Student, related_name='grades', on_delete=models.CASCADE, default=None)
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