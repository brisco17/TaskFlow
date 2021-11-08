from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .permissions import IsAuthor
from rest_framework.parsers import JSONParser
from .models import Tag
from .serializers import TagSerializer
from rest_framework import generics, permissions


class TagList(generics.ListCreateAPIView):
    "Use this endpoint to obtain all of a users tags."
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthor] 

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class TagDetail(generics.RetrieveUpdateDestroyAPIView):
    "Use this endpoint to obtain a users individual tags."
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthor] 