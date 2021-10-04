from django.db import models

# Create your models here.


class Task(models.Model):
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=100)
    creation_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    completion_date = models.DateField(blank=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return "{} - {}".format(self.title,self.due_date,self.completed)