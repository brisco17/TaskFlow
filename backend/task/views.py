from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from .models import Task
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import TaskSerializer
from rest_framework.decorators import api_view


# Create your views here.
@api_view(['GET', 'POST', 'DELETE'])
def task_list(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        
        title = request.query_params.get('title', None)
        if title is not None:
            tasks = tasks.filter(title__icontains=title)
        
        tasks_serializer = TaskSerializer(tasks, many=True)
        return JsonResponse(tasks_serializer.data, safe=False)
        # 'safe=False' for objects serialization
 
    elif request.method == 'POST':
        task_data = JSONParser().parse(request)
        task_serializer = TaskSerializer(data=task_data)
        if task_serializer.is_valid():
            task_serializer.save()
            return JsonResponse(task_serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(task_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        count = Task.objects.all().delete()
        return JsonResponse({'message': '{} Tutorials were deleted successfully!'.format(count[0])}, status=status.HTTP_204_NO_CONTENT)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('due_date')
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]