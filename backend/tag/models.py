from django.db import models
from django.conf import settings
from rest_framework import serializers

class Tag(models.Model):
    # allow users to define a title and description for a tag
    title = models.CharField(max_length=20, unique=True)
    description = models.CharField(max_length=100)

    # associate tags with a user
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, # on delete all of this users tags will be removed
    )
    
class CommentSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()


