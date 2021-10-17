from django.urls import path
from tag import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('tags/' , views.TagList.as_view()),
    path('tags/<int:pk>' , views.TagDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)