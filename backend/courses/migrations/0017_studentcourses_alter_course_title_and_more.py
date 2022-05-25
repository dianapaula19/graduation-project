# Generated by Django 4.0.4 on 2022-05-25 11:19

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_remove_student_category_and_more'),
        ('courses', '0016_remove_optionslist_category_optionslist_degree_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentCourses',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(4)])),
                ('semester', models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(2)])),
            ],
        ),
        migrations.AlterField(
            model_name='course',
            name='title',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='optionslist',
            name='title',
            field=models.CharField(max_length=255),
        ),
        migrations.AddConstraint(
            model_name='optionslist',
            constraint=models.UniqueConstraint(fields=('domain', 'learning_mode', 'degree', 'study_program', 'year', 'semester', 'title'), name='unique_migration_options_list'),
        ),
        migrations.AddField(
            model_name='studentcourses',
            name='courses',
            field=models.ManyToManyField(related_name='student_courses', to='courses.course'),
        ),
        migrations.AddField(
            model_name='studentcourses',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.student'),
        ),
    ]
