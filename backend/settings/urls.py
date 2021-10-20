from django.urls import path
from settings import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('settings/' , views.SettingList.as_view()),
    path('settings/<int:pk>' , views.SettingDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)