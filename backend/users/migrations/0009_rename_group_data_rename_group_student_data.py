# Generated by Django 4.0.3 on 2022-05-22 14:51

from django.db import migrations


class Migration(migrations.Migration):

  dependencies = [
    ('courses', '0008_rename_group_optionslist_data'),
    ('users', '0008_remove_group_semester_remove_group_year_and_more'),
  ]

  operations = [
    migrations.RenameModel(
      old_name='Group',
      new_name='Data',
    ),
    migrations.RenameField(
      model_name='student',
      old_name='group',
      new_name='data',
    ),
  ]
