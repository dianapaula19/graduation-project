# Generated by Django 4.0.4 on 2022-05-24 19:13

from django.db import migrations, models


class Migration(migrations.Migration):

  dependencies = [
    ('users', '0011_category_unique_migration_domain_learning_mode_degree_study_program'),
  ]

  operations = [
    migrations.AddField(
      model_name='user',
      name='role',
      field=models.TextField(choices=[('student', 'Student'), ('teacher', 'Teacher'), ('secretary', 'Secretary')], null=True),
    ),
  ]
