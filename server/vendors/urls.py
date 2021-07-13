from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path("gunmen/", views.GunmenList.as_view()),
    path("gunmen/<int:pk>/", views.GunmenDetail.as_view()),
    path("vendor/", views.VendorList.as_view()),
    path("vendor/<int:pk>/", views.VendorDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
