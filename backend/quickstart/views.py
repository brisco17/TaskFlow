from django.shortcuts import render
  
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.reverse import reverse


class ApiRoot(APIView):
    """
    'Welcome to the Young Chow Enthusiasts API. This page will be updated with our endpoints as production continues.'
    """
    name = 'Young Chow Enthusiasts API'
