# Generated by Django 5.2.1 on 2025-05-21 18:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0003_alter_user_groups'),
        ('auth', '0019_alter_groups_permission'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='groups',
        ),
        migrations.AddField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(to='auth.groups'),
        ),
    ]
