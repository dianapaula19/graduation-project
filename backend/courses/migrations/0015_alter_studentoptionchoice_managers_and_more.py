# Generated by Django 4.0.3 on 2022-05-22 20:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0014_remove_studentoptionchoice_unique_migration_student_order_and_more'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='studentoptionchoice',
            managers=[
            ],
        ),
        migrations.RemoveConstraint(
            model_name='studentoptionchoice',
            name='unique_migration_options_list_order',
        ),
    ]
