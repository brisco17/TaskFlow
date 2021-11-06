from .models import Task
from rest_framework import serializers

class TaskSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    class Meta:
        model = Task
        fields = ['id','user','title',
                'description','subtasks',
                'creation_date','due_date',
                'completion_date','completed',
                'tag',]
        

