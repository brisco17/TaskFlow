# Generated by Django 3.2.9 on 2021-12-02 06:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tag', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=30)),
                ('description', models.CharField(max_length=100)),
                ('subtasks', models.JSONField(blank=True, null=True)),
                ('reminder', models.CharField(blank=True, max_length=36, null=True)),
                ('attachedFile', models.CharField(blank=True, max_length=40, null=True)),
                ('creation_date', models.DateField(auto_now_add=True)),
                ('due_date', models.DateField()),
                ('completion_date', models.DateField(blank=True, null=True)),
                ('completed', models.BooleanField(default=False)),
                ('tag', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='task', to='tag.tag')),
            ],
        ),
    ]
