# Generated by Django 5.2.1 on 2025-05-21 17:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0002_alter_user_groups'),
        ('auth', '0017_alter_groups_options_alter_groups_permission'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='groups',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='user_set', related_query_name='user', to='auth.groups'),
        ),
    ]
