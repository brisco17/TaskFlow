from rest_framework import serializers

from .models import UserProfile
from settings.models import Setting

class UserProfileSerializer(serializers.ModelSerializer):
    settings = serializers.PrimaryKeyRelatedField(many=True, queryset=Setting.objects.all())

    class Meta:
        model = UserProfile
        fields = ['id', 'email', 'settings',]