from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path("attendance/", views.AttendanceList.as_view()),
    path("attendance/<int:pk>/", views.AttendanceDetail.as_view()),

    path("attendance/vehicle/", views.AttendanceVehicleList.as_view()),
    path("attendance/vehicle/<int:pk>/", views.AttendanceVehicleDetail.as_view()),

    path("trip/", views.TripList.as_view()),
    path("trip/<int:pk>/", views.TripDetail.as_view()),

    path("issue/", views.IssueList.as_view()),
    path("issue/<int:pk>/", views.IssueDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
