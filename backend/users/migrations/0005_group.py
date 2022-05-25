# Generated by Django 4.0.3 on 2022-05-11 17:35

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_remove_user_roles_alter_student_study_program_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('domain', models.TextField(choices=[('Informatică', 'Info'), ('Calculatoare și Tehnologia Informației', 'Cti'), ('Matematică', 'Mate')])),
                ('learning_mode', models.TextField(choices=[('Învățământ cu Frecvență', 'If'), ('Învățământ cu Frecvență Redusă', 'Ifr'), ('Învățământ la Distanță', 'Id')])),
                ('degree', models.TextField(choices=[('Licență', 'Licenta'), ('Master', 'Master')])),
                ('study_program', models.TextField(choices=[('Natural Language Processing', 'Nlp'), ('Data Science', 'Ds'), ('Securitate și Logică Aplicată', 'Sla'), ('Sisteme Distribuite', 'Sd'), ('Inteligență Artificială', 'Ia'), ('Inginerie Software', 'Is'), ('Baze de Date și Tehnologii Software', 'Bdts'), ('Probabilități și Statistică în Finanțe și Științe', 'Psfs'), ('Matematică Didactică', 'Md'), ('Advanced Studies in Mathematics', 'Asm'), ('Tehnlogia Informației', 'Ti'), ('Informatică', 'Info'), ('Matematică-Informatică', 'Mateinfo'), ('Matematică', 'Mate'), ('Matematici Aplicate', 'Ma')])),
                ('year', models.IntegerField(validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(4)])),
            ],
        ),
    ]