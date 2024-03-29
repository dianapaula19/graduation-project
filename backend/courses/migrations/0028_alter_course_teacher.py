# Generated by Django 4.0.4 on 2022-08-14 15:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0031_alter_teacher_user'),
        ('courses', '0027_remove_course_degree'),
    ]

    operations = [
        migrations.AlterField(
            model_name='course',
            name='teacher',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='courses', to='users.teacher'),
        ),
    ]
