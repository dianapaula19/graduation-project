# Generated by Django 4.0.4 on 2022-08-13 00:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0025_alter_course_options_alter_optionslist_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='optionslist',
            name='study_program',
            field=models.TextField(choices=[('NLP', 'Nlp'), ('DS', 'Ds'), ('SAL', 'Sal'), ('AMA', 'Ama'), ('SD', 'Sd'), ('AI', 'Ai'), ('IS', 'Is'), ('BDTS', 'Bdts'), ('PSFS', 'Psfs'), ('MD', 'Md'), ('ASM', 'Asm'), ('TI', 'Ti'), ('INFO', 'Info'), ('MATEINFO', 'Mateinfo'), ('MATE', 'Mate'), ('MA', 'Ma')], null=True),
        ),
    ]
