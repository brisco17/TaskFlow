from django.db import models
from django.conf import settings

# Create your models here.

class Task(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name = 'task',
        on_delete=models.CASCADE
    )
    tag = models.ForeignKey(
        'tag.Tag',
        on_delete=models.SET_NULL,
        blank = True,
        related_name='task',
        null = True
    )
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=1000, blank=True)
    subtasks = models.JSONField(null=True, blank=True,)
    reminder = models.JSONField()
    attachedFile = models.CharField(max_length=200, null=True, blank=True)
    creation_date = models.DateField(auto_now_add=True)
    due_date = models.JSONField()
    completion_date = models.DateField(blank=True,null=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return "{} - {}".format(self.title,self.due_date,self.completed)