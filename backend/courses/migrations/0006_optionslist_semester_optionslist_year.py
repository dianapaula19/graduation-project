# Generated by Django 4.0.3 on 2022-05-22 14:15

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0005_optionslist_courses'),
    ]

    operations = [
        migrations.AddField(
            model_name='optionslist',
            name='semester',
            field=models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(2)]),
        ),
        migrations.AddField(
            model_name='optionslist',
            name='year',
            field=models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(4)]),
        ),
    ]