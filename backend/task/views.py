from .models import Task
from .serializers import TaskSerializer
from rest_framework import generics, permissions
from .permissions import IsOwner



class TaskList(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        queryset = Task.objects.all().filter(owner=self.request.user)
        return queryset
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated,IsOwner]
