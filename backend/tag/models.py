from django.db import models
from django.conf import settings
from django.db.models.deletion import CASCADE

class Tag(models.Model):
    "Model to define tags to use for grouping objects"
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=200, blank=True)

    # store author of the tag, all tags should be deleted when a user is deleted
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="tag", on_delete=models.CASCADE,)