from django.shortcuts import render
  
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.reverse import reverse


class ApiRoot(generics.GenericAPIView):
    name = 'api-root'
    def get(self, request, *args, **kwargs):
        return Response({
            'Welcome to the Young Chow Enthusiasts API. This page will be updated with our endpoints as production continues.'
            })    
