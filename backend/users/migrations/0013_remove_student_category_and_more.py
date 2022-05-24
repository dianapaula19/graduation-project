# Generated by Django 4.0.4 on 2022-05-24 21:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0016_remove_optionslist_category_optionslist_degree_and_more'),
        ('users', '0012_user_role'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='category',
        ),
        migrations.RemoveField(
            model_name='student',
            name='current_semester',
        ),
        migrations.AddField(
            model_name='student',
            name='degree',
            field=models.TextField(choices=[('Licență', 'Licenta'), ('Master', 'Master')], default='Licență'),
        ),
        migrations.AddField(
            model_name='student',
            name='domain',
            field=models.TextField(choices=[('Informatică', 'Info'), ('Calculatoare și Tehnologia Informației', 'Cti'), ('Matematică', 'Mate')], default='Informatică'),
        ),
        migrations.AddField(
            model_name='student',
            name='learning_mode',
            field=models.TextField(choices=[('Învățământ cu Frecvență', 'If'), ('Învățământ cu Frecvență Redusă', 'Ifr'), ('Învățământ la Distanță', 'Id')], default='Învățământ cu Frecvență'),
        ),
        migrations.AddField(
            model_name='student',
            name='study_program',
            field=models.TextField(choices=[('Natural Language Processing', 'Nlp'), ('Data Science', 'Ds'), ('Securitate și Logică Aplicată', 'Sla'), ('Sisteme Distribuite', 'Sd'), ('Inteligență Artificială', 'Ia'), ('Inginerie Software', 'Is'), ('Baze de Date și Tehnologii Software', 'Bdts'), ('Probabilități și Statistică în Finanțe și Științe', 'Psfs'), ('Matematică Didactică', 'Md'), ('Advanced Studies in Mathematics', 'Asm'), ('Tehnlogia Informației', 'Ti'), ('Informatică', 'Info'), ('Matematică-Informatică', 'Mateinfo'), ('Matematică', 'Mate'), ('Matematici Aplicate', 'Ma')], default='Informatică'),
        ),
        migrations.DeleteModel(
            name='Category',
        ),
    ]
