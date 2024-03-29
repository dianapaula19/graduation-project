# Generated by Django 4.0.3 on 2022-03-15 18:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

  dependencies = [
    ('users', '0002_role_student_teacher_grade_user_roles'),
  ]

  operations = [
    migrations.AlterField(
      model_name='grade',
      name='student',
      field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='grades', to='users.student'),
    ),
    migrations.AlterField(
      model_name='student',
      name='degree',
      field=models.TextField(choices=[('Licență', 'Licenta'), ('Master', 'Master')]),
    ),
    migrations.AlterField(
      model_name='student',
      name='domain',
      field=models.TextField(choices=[('Informatică', 'Info'), ('Calculatoare și Tehnologia Informației', 'Cti'), ('Matematică', 'Mate')]),
    ),
    migrations.AlterField(
      model_name='student',
      name='learning_mode',
      field=models.TextField(choices=[('Învățământ cu Frecvență', 'If'), ('Învățământ cu Frecvență Redusă', 'Ifr'), ('Învățământ la Distanță', 'Id')]),
    ),
    migrations.AlterField(
      model_name='student',
      name='study_program',
      field=models.TextField(choices=[('Licență', 'Licenta'), ('Master', 'Master')]),
    ),
  ]
