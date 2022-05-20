# Generated by Django 4.0.3 on 2022-05-11 17:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_group'),
        ('courses', '0002_course_capacity'),
    ]

    operations = [
        migrations.CreateModel(
            name='OptionsList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('course_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='courses.course')),
                ('group_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.group')),
            ],
        ),
    ]
