from .models import Setting
from rest_framework import serializers

class SettingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Setting
        fields = ["id", 'name', 'value',]
        #owner = serializers.ReadOnlyField(source='owner.username')

