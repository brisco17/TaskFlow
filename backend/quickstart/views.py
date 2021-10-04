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
import json

from django.db import IntegrityError
from django.core.exceptions import ValidationError
from django.db.models.expressions import F
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import AccountManager, RegistrationSerializer, User

from django.shortcuts import render
from django.http import HttpResponse



# Create your views here.

def index(request):
    return HttpResponse('Hello World!')

@csrf_exempt
@api_view(["POST"])
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



@api_view(["POST"])
@permission_classes((AllowAny,))
def RegisterUsers(req):
    try:
        data=[]
        serializer = RegistrationSerializer(data=req.data)
        if serializer.is_valid():
            new_user = User()
            acc_man = AccountManager()
            new_user = acc_man.create_user(new_user, req.data.get("email"), req.data.get("name"), req.data.get("username"), req.data.get("password"))
            return Response({'success' : 'user successfully created', 'user-id' : str(new_user.pk)})
        else:
            data = serializer.errors
            return Response(data)

    except KeyError as e:
        print(e)
        raise ValidationError({"400":f'Field {str(e)} missing'})
