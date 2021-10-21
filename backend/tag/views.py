from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from settings.permissions import IsOwner
from rest_framework.parsers import JSONParser
from .models import Tag
from .serializers import TagSerializer
from rest_framework import generics, permissions


class TagList(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwner] 

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class TagDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwner] 