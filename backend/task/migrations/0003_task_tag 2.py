# Generated by Django 3.2.8 on 2021-10-25 00:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tag', '0001_initial'),
        ('task', '0002_task_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='tag',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='task', to='tag.tag'),
        ),
    ]