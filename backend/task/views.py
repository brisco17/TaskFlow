from django.shortcuts import render

from django.http.response import JsonResponse, HttpResponse
#from backend import task
from rest_framework.parsers import JSONParser
from rest_framework import status

from .models import Task
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import TaskSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response


 # Create your views here.
@api_view(['GET', 'POST'])
def task_list(request, format=None):
    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET', 'PUT', 'DELETE'])
def task_detail(request, pk, format=None):
    try:
        snippet = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TaskSerializer(snippet)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TaskSerializer(snippet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        snippet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
