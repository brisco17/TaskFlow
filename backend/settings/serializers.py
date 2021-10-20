from .models import Setting
from rest_framework import serializers

class SettingSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    
    class Meta:
        model = Setting
        fields = ["id", 'name', 'value', 'user',]

