from django.shortcuts import render
from rest_framework import mixins
from rest_framework import generics
from .models import Vendor, Gunmen
from .serializers import VendorSerializer, GunmenSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class VendorList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class VendorDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class GunmenList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = Gunmen.objects.all()
    serializer_class = GunmenSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    # filter_backends = [DjangoFilterBackend]
    search_fields = ["^first_name", "^last_name"]
    filterset_fields = ["first_name", "last_name", "vendor"]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class GunmenDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = Gunmen.objects.all()
    serializer_class = GunmenSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
