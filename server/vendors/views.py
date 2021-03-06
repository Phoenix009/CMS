from rest_framework import generics
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import permissions

from .models import Custodian, Vehicle, Vendor, Gunmen
from .serializers import (
    VehicleSerializer,
    VendorSerializer,
    GunmenSerializer,
    CustodianSerializer,
)


class CustodianList(generics.ListCreateAPIView):
    permissions = [permissions.IsAuthenticated]
    queryset = Custodian.objects.all()
    serializer_class = CustodianSerializer
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
    permissions = [permissions.IsAuthenticated]
    queryset = Custodian.objects.all()
    serializer_class = CustodianSerializer
    ordering_fields = "__all__"


class VendorList(generics.ListCreateAPIView):
    permissions = [permissions.IsAuthenticated]
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
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

    def create(self, request, *args, **kwargs):
        current_user = self.request.user
        self.request.data['created_by'] = current_user.id
        return super().create(request, *args, **kwargs)


class VendorDetail(generics.RetrieveUpdateDestroyAPIView):
    permissions = [permissions.IsAuthenticated]
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    ordering_fields = "__all__"


class GunmenList(generics.ListCreateAPIView):
    permissions = [permissions.IsAuthenticated]
    queryset = Gunmen.objects.all()
    serializer_class = GunmenSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["^first_name", "^last_name"]
    filterset_fields = ["first_name", "last_name", "vendor"]
    ordering_fields = "__all__"


class GunmenDetail(generics.RetrieveUpdateDestroyAPIView):
    permissions = [permissions.IsAuthenticated]
    queryset = Gunmen.objects.all()
    serializer_class = GunmenSerializer


class VehicleList(generics.ListCreateAPIView):
    permissions = [permissions.IsAuthenticated]
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["^model_name", "^number_plate"]
    filterset_fields = ["model_name", "vendor", "number_plate"]
    ordering_fields = "__all__"


class VehicleDetail(generics.RetrieveUpdateDestroyAPIView):
    permissions = [permissions.IsAuthenticated]
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
