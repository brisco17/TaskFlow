from rest_framework import generics, permissions

from .models import Setting
from .permissions import IsAuthor
from .serializers import SettingSerializer


class SettingList(generics.ListCreateAPIView):
    "Use this endpoint to obtain all of a users settings."
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [IsAuthor]

    def perform_create(self, serializer):
       serializer.save(user=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class SettingDetail(generics.RetrieveUpdateDestroyAPIView):
    "Use this endpoint to obtain a users individual settings."
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [IsAuthor]