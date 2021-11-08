from django.db import models
from django.conf import settings


class Setting(models.Model):
    """
    Model to be used to store any user preferences and other miscellaneous
    pieces of information collected from users.
    """
    name = models.CharField(max_length=20)
    value = models.CharField(max_length=500)

    # on delete all of this user's settings will be removed
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name = 'setting', on_delete=models.CASCADE,) 
    


