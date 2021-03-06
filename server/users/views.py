from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Branch, Region
from .serializers import BranchSerializer, RegionSerializer, UserSerializer

# TODO: Decouple list and create views for user


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["^first_name", "^last_name", "^username", "^email"]
    filterset_fields = [
        "first_name",
        "last_name",
        "username",
        "email",
        "profile__gender",
        "is_staff",
        "is_active",
        "is_superuser",
    ]
    ordering_fields = "__all__"


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    permissions = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class BranchList(generics.ListCreateAPIView):
    permissions = [permissions.IsAuthenticated]
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["^name", "^address"]
    filterset_fields = ["name", "address", "branch_manager", "region"]
    ordering_fields = "__all__"


class BranchDetail(generics.RetrieveUpdateDestroyAPIView):
    permissions = [permissions.IsAuthenticated]
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer


class RegionList(generics.ListCreateAPIView):
    permissions = [permissions.IsAuthenticated]
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["^name", "^address"]
    filterset_fields = ["name", "address", "regional_officer"]
    ordering_fields = "__all__"


class RegionDetail(generics.RetrieveUpdateDestroyAPIView):
    permissions = [permissions.IsAuthenticated]
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


@api_view(['GET'])
def get_current_user(request):
    user_id = request.user.id
    user = get_object_or_404(User, pk=user_id)
    serializer = UserSerializer(user)
    return Response(serializer.data)
