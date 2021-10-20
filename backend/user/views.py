from rest_framework import generics

from .models import UserProfile
from .serializers import UserProfileSerializer


class UserProfileList(generics.ListAPIView):
    queryset = UserProfile.objects.all()
    serializers_class = UserProfileSerializer


class UserProfileDetail(generics.RetrieveAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer