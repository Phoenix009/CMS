from datetime import datetime
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from attendance.models import (
    Attendance,
    AttendanceVehicle,
    Issue,
    Trip,
)

from attendance.serializers import (
    AttendanceSerializer,
    AttendanceUpdateSerializer,
    IssueSerializer,
    TripSerializer,
    TripCreateSerializer,
    AttendanceVehicleSerializer,
)


class TripCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Trip.objects.all()
    serializer_class = TripCreateSerializer

    def post(self, request, *args, **kwargs):
        custodian_1 = request.data.get("custodian_1")
        custodian_2 = request.data.get("custodian_2")
        custodian_3 = request.data.get("custodian_3")

        if (custodian_1 == custodian_2) or \
            (custodian_1 == custodian_3) or \
                (custodian_3 == custodian_2):
            return Response(
                {"error": "The same custodian cannot be added more than once"},
                status=status.HTTP_400_BAD_REQUEST)

        return super().post(request, *args, **kwargs)


class TripList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = [
        "^custodian_1__first_name",
        "^custodian_1__last_name",
        "^custodian_2__first_name",
        "^custodian_2__last_name",
        "^custodian_3__first_name",
        "^custodian_3__last_name",
        "^vehicle__number_plate",
        "^vehicle__model_name",
    ]

    filterset_fields = {
        "entry_time": ["gte", "lte", "exact", "gt", "lt"],
        "exit_time": ["gte", "lte", "exact", "gt", "lt"],
        "custodian_1": ["exact"],
        "custodian_2": ["exact"],
        "custodian_3": ["exact"],
        "vehicle": ["exact"],
        "added_by": ["exact"],
        "branch": ["exact"],
    }
    ordering_fields = "__all__"


class TripDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def put(self, request, *args, **kwargs):
        custodian_1 = request.data.get("custodian_1")
        custodian_2 = request.data.get("custodian_2")
        custodian_3 = request.data.get("custodian_3")

        if (custodian_1 == custodian_2) or \
            (custodian_1 == custodian_3) or \
                (custodian_3 == custodian_2):
            return Response(
                {"error": "The same custodian cannot be added more than once"},
                status=status.HTTP_400_BAD_REQUEST)

        return self.update(request, *args, **kwargs)


class AttendanceVehicleList(generics.ListCreateAPIView):
    queryset = AttendanceVehicle.objects.all()
    serializer_class = AttendanceVehicleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["^vehicle__model_name", "^vehicle__number_plate"]

    filterset_fields = {
        "entry_time": ["gte", "lte", "exact", "gt", "lt"],
        "exit_time": ["gte", "lte", "exact", "gt", "lt"],
        "vehicle": ["exact"],
        "added_by": ["exact"],
        "branch": ["exact"],
        "attendance_sheet": ["exact"],
    }

    ordering_fields = "__all__"


class AttendanceVehicleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = AttendanceVehicle.objects.all()
    serializer_class = AttendanceVehicleSerializer


class AttendanceList(generics.ListCreateAPIView):
    # When the object of attendance is created for a custodian then
    # the start time of the attendance is initialized
    # For the exit time the same attendance object can be update
    # with the `exit` flag set to True

    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["^custodian__first_name", "^custodian__last_name"]

    filterset_fields = {
        "entry_time": ["gte", "lte", "exact", "gt", "lt"],
        "exit_time": ["gte", "lte", "exact", "gt", "lt"],
        "custodian": ["exact"],
        "added_by": ["exact"],
        "branch": ["exact"],
        "attendance_sheet": ["exact"],
    }

    ordering_fields = "__all__"

    def get_queryset(self):
        params = self.request.query_params
        start_date = params.get("start_date", datetime.min)
        end_date = params.get("end_date", datetime.max)

        queryset = self.filter_queryset(self.queryset)
        queryset = queryset.filter(entry_time__date__range=[
                                   start_date, end_date])
        return queryset


class AttendanceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceUpdateSerializer

    def put(self, request, *args, **kwargs):
        exit_flg = request.data.get('exit', False)
        if exit_flg:
            request.data['exit_time'] = datetime.now()

        return super().put(request, *args, **kwargs)


class IssueList(generics.ListCreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    ordering_fields = "__all__"


class IssueDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
