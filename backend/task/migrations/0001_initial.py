# Generated by Django 3.2.9 on 2021-12-06 06:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tag', '0002_tag_user'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('description', models.CharField(blank=True, max_length=1000)),
                ('subtasks', models.JSONField(blank=True, null=True)),
                ('reminder', models.JSONField(blank=True, null=True)),
                ('attachedFile', models.CharField(blank=True, max_length=200, null=True)),
                ('creation_date', models.DateField(auto_now_add=True)),
                ('due_date', models.JSONField()),
                ('completion_date', models.DateField(blank=True, null=True)),
                ('completed', models.BooleanField(default=False)),
                ('tag', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='task', to='tag.tag')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
