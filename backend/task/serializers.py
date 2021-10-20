from .models import Task
from rest_framework import serializers

class TaskSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = ['id','owner','title','description','creation_date','due_date','completion_date','completed']
        owner = serializers.ReadOnlyField(source='owner.username')

