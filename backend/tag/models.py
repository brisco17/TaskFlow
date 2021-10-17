from django.db import models
from django.conf import settings

class Tag(models.Model):
    # allow users to define a title and description for a tag
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=100)