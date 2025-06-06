# Generated by Django 5.2.1 on 2025-05-29 10:27

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('client', models.CharField(max_length=64)),
                ('address', models.CharField(max_length=1024)),
            ],
            options={
                'verbose_name_plural': 'Clients',
            },
        ),
        migrations.CreateModel(
            name='Period',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, unique=True)),
                ('days', models.PositiveIntegerField(default=7)),
            ],
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='ServicesCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64, unique=True)),
            ],
            options={
                'verbose_name_plural': 'Services Categories',
            },
        ),
        migrations.CreateModel(
            name='PriceList',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.PositiveIntegerField(default=30)),
                ('unit_period', models.PositiveIntegerField(default=1)),
                ('period', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='ManagementSystem.period')),
            ],
        ),
        migrations.CreateModel(
            name='Representative',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64, unique=True)),
                ('client', models.ManyToManyField(blank=True, related_name='Representative', to='ManagementSystem.client')),
            ],
        ),
        migrations.AddField(
            model_name='client',
            name='representative',
            field=models.ManyToManyField(blank=True, related_name='Client', to='ManagementSystem.representative'),
        ),
        migrations.CreateModel(
            name='Plan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('PriceList', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='Plan', to='ManagementSystem.pricelist')),
                ('service', models.ForeignKey(default=None, on_delete=django.db.models.deletion.PROTECT, to='ManagementSystem.service')),
            ],
        ),
        migrations.AddField(
            model_name='service',
            name='services',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.PROTECT, to='ManagementSystem.servicescategory'),
        ),
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('begin', models.DateTimeField(default=datetime.datetime.now, null=True)),
                ('end', models.DateTimeField(blank=True, null=True)),
                ('client', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='Subscription', to='ManagementSystem.client')),
            ],
        ),
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('DRAFT', 'Draft'), ('PAID', 'Paid'), ('OVERDUE', 'Overdue'), ('VOID', 'Void'), ('UNCOLLECTABLE', 'Uncollectable')], default='Draft', max_length=15)),
                ('created', models.DateField(auto_now_add=True)),
                ('due_date', models.DateField(blank=True, null=True)),
                ('client', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='Invoice', to='ManagementSystem.client')),
                ('representative', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='Invoice', to='ManagementSystem.representative')),
                ('subscription', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='Invoice', to='ManagementSystem.subscription')),
            ],
        ),
        migrations.CreateModel(
            name='SubscriptionPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('ACTIVE', 'Active'), ('CANCELLED', 'Cancelled'), ('DEACTIVE', 'Deactive'), ('EXPIRED', 'Expired'), ('ENDED', 'Ended')], default='Draft', max_length=15)),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='ManagementSystem.plan')),
                ('subscription', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='SubscriptionPlans', to='ManagementSystem.subscription')),
            ],
        ),
    ]
