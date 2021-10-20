from .models import Setting
from .serializers import SettingSerializer
from rest_framework import generics
#from rest_framework import permissions



class SettingList(generics.ListCreateAPIView):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly]


    #def perform_create(self, serializer):
    #    serializer.save(owner=self.request.user)


class SettingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly]
