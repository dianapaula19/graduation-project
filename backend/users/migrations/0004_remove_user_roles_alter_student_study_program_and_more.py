# Generated by Django 4.0.3 on 2022-05-11 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

  dependencies = [
    ('users', '0003_alter_grade_student_alter_student_degree_and_more'),
  ]

  operations = [
    migrations.RemoveField(
      model_name='user',
      name='roles',
    ),
    migrations.AlterField(
      model_name='student',
      name='study_program',
      field=models.TextField(choices=[('Natural Language Processing', 'Nlp'), ('Data Science', 'Ds'), ('Securitate și Logică Aplicată', 'Sla'), ('Sisteme Distribuite', 'Sd'), ('Inteligență Artificială', 'Ia'), ('Inginerie Software', 'Is'), ('Baze de Date și Tehnologii Software', 'Bdts'), ('Probabilități și Statistică în Finanțe și Științe', 'Psfs'), ('Matematică Didactică', 'Md'), ('Advanced Studies in Mathematics', 'Asm'), ('Tehnlogia Informației', 'Ti'), ('Informatică', 'Info'), ('Matematică-Informatică', 'Mateinfo'), ('Matematică', 'Mate'), ('Matematici Aplicate', 'Ma')]),
    ),
    migrations.AlterField(
      model_name='user',
      name='first_name',
      field=models.TextField(verbose_name='first name'),
    ),
    migrations.AlterField(
      model_name='user',
      name='last_name',
      field=models.TextField(verbose_name='last name'),
    ),
    migrations.DeleteModel(
      name='Role',
    ),
  ]
