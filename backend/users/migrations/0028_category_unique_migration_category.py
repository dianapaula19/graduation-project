# Generated by Django 4.0.4 on 2022-08-09 18:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0027_remove_category_study_program'),
    ]

    operations = [
        migrations.AddConstraint(
            model_name='category',
            constraint=models.UniqueConstraint(fields=('domain', 'learning_mode', 'degree', 'year'), name='unique_migration_category'),
        ),
    ]
