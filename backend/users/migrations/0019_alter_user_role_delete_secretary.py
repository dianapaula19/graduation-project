# Generated by Django 4.0.4 on 2022-06-08 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

  dependencies = [
    ('users', '0018_secretary_alter_user_role'),
  ]

  operations = [
    migrations.AlterField(
      model_name='user',
      name='role',
      field=models.TextField(choices=[('student', 'Student'), ('teacher', 'Teacher'), ('admin', 'Admin')], null=True),
    ),
    migrations.DeleteModel(
      name='Secretary',
    ),
  ]
