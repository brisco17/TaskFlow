from django.urls import path
from settings import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('' , views.SettingList.as_view()),
    path('<int:pk>' , views.SettingDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)