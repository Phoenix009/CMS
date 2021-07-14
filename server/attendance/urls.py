from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path("attendance/", views.AttendanceList.as_view()),
    path("attendance/<int:pk>/", views.AttendanceDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
