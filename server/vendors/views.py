from django.shortcuts import render
from rest_framework import mixins
from rest_framework import generics
from .models import Vendor, Gunmen
from .serializers import VendorSerializer, GunmenSerializer


class VendorList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class GunmenList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = Gunmen.objects.all()
    serializer_class = GunmenSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
