from .models import Task
from .serializers import TaskSerializer
from rest_framework import generics, permissions
from .permissions import IsAuthor



class TaskList(generics.ListCreateAPIView):
    "Use this endpoint to obtain all of a users tasks"
    serializer_class = TaskSerializer
    permission_classes = [IsAuthor]
    def get_queryset(self):
        queryset = Task.objects.all().filter(user=self.request.user)
        return queryset
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    "Use this endpoint to obtain a users individual tasks"
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthor]
