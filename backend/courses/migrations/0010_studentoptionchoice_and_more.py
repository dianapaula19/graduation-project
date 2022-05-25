# Generated by Django 4.0.3 on 2022-05-22 15:51

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_rename_data_category_rename_data_student_category'),
        ('courses', '0009_rename_data_optionslist_category'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentOptionChoice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField(validators=[django.core.validators.MinValueValidator(0)])),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.course')),
                ('options_list', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.optionslist')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.student')),
            ],
        ),
        migrations.AddConstraint(
            model_name='studentoptionchoice',
            constraint=models.UniqueConstraint(fields=('student', 'options_list', 'course', 'order'), name='unique_migration_student_options_list_course_order'),
        ),
    ]