from rest_framework import mixins
from rest_framework import generics
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import Custodian, Vehicle, Vendor, Gunmen
from .serializers import (
    VehicleSerializer,
    VendorSerializer,
    GunmenSerializer,
    CustodianSerializer,
)


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "count": self.page.paginator.count,
                "page_size": self.page_size,
                "results": data,
            }
        )


class CustodianList(generics.ListCreateAPIView):
    queryset = Custodian.objects.all()
    serializer_class = CustodianSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = [
        "^first_name",
        "^last_name",
        "^phone_number",
        "^email",
        "^vendor__name",
    ]
    filterset_fields = [
        "custodian_type",
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "vendor",
    ]
    ordering_fields = "__all__"


class CustodianDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Custodian.objects.all()
    serializer_class = CustodianSerializer
    ordering_fields = "__all__"


class VendorList(generics.ListCreateAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["^name", "^address", "^contact", "^officer_incharge"]
    filterset_fields = [
        "name",
        "address",
        "email",
        "contact",
        "officer_incharge",
        "created_by",
        "created_at",
    ]
    ordering_fields = "__all__"


class VendorDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    ordering_fields = "__all__"


class GunmenList(generics.ListCreateAPIView):
    queryset = Gunmen.objects.all()
    serializer_class = GunmenSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["^first_name", "^last_name"]
    filterset_fields = ["first_name", "last_name", "vendor"]
    ordering_fields = "__all__"


class GunmenDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Gunmen.objects.all()
    serializer_class = GunmenSerializer


class VehicleList(generics.ListCreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["^model_name", "^number_plate"]
    filterset_fields = ["model_name", "vendor", "number_plate"]
    ordering_fields = "__all__"


class VehicleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
