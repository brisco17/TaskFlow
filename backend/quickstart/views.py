from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK
)
from rest_framework.response import Response

from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.

def index(request):
    return HttpResponse('Hello World!')

@csrf_exempt
@api_view(["GET"])
@permission_classes((AllowAny,))
def login(req):
    # get data from request
    uname = req.data.get("username")
    pwd = req.data.get("password")

    # handle bad input
    if uname is None or pwd is None:
        return Response({'error': 'Username and password required.'}, 
            status = HTTP_400_BAD_REQUEST)

    # authenticate user 
    user = authenticate(username=uname, password = pwd) 
    if not user:
        return Response({'error': 'Invalid Credentials'}, 
                status = HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token' : token.key},
                status = HTTP_200_OK)
