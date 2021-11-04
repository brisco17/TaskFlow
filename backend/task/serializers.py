from .models import Task
from rest_framework import serializers

class TaskSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.ReadOnlyField(source='user.email')
    class Meta:
        model = Task
        fields = ['id','user','title','description','creation_date','due_date','completion_date','completed', 'tag',]
        

