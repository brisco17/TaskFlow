from django.db import models
from django.conf import settings
from django.db.models.deletion import CASCADE

class Tag(models.Model):
    "Model to define tags to use for grouping objects"
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=100)

    # store author of the tag, all tags should be deleted when a user is deleted
    #TODO: needs a default value. - should default to the one who sent the request but like how 
    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="tag", on_delete=models.CASCADE,)