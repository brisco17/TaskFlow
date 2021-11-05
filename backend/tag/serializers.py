from rest_framework import serializers
from .models import Tag

class TagSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Tag
        fields = ['pk','title','description', 'user',]