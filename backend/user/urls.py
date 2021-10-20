from django.urls import path
import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('users/' , views.UserProfileList.as_view()),
    path('users/<int:pk>' , views.UserProfileDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)