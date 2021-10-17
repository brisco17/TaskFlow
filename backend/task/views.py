from .models import Task
from .serializers import TaskSerializer
from rest_framework import generics
#from rest_framework import permissions



class TaskList(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly]


    #def perform_create(self, serializer):
    #    serializer.save(owner=self.request.user)


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly]
