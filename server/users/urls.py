from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path("user/", views.UserList.as_view()),
    path("user/<int:pk>/", views.UserDetail.as_view()),
    path("branch/", views.BranchList.as_view()),
    path("branch/<int:pk>/", views.BranchDetail.as_view()),
    path("region/", views.RegionList.as_view()),
    path("region/<int:pk>/", views.RegionDetail.as_view()),
    path("current/", views.get_current_user),
]

urlpatterns = format_suffix_patterns(urlpatterns)
