from django.db import models
from django.conf import settings

# Create your models here.

class Task(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="task", on_delete=models.CASCADE,blank=True, null=True)
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=100)
    creation_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    completion_date = models.DateField(blank=True,null=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return "{} - {}".format(self.title,self.due_date,self.completed)