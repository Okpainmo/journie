# Generated by Django 5.1.4 on 2024-12-15 00:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('entry', '0002_entry_created_by'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='entry',
            name='created_by',
        ),
    ]
