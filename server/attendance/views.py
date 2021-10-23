from datetime import datetime
from secrets import token_hex

from django.shortcuts import get_object_or_404

from rest_framework import mixins
from rest_framework import generics
from rest_framework import filters

from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import (
    BasicAuthentication,
    SessionAuthentication,
    TokenAuthentication,
)
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from users.serializers import BranchSerializer, UserSerializer
from vendors.serializers import CustodianSerializer, VehicleSerializer
from attendance.serializers import (
    AttendanceSerializer,
    IssueSerializer,
    TripSerializer,
    AttendanceVehicleSerializer,
)

from users.models import Branch, User
from vendors.models import Custodian, Vehicle, Gunmen
from attendance.models import (
    Attendance,
    AttendanceSheet,
    AttendanceVehicle,
    Issue,
    Trip,
)
from attendance.utils import qs_to_local_csv


# @csrf_exempt
class TripList(generics.ListCreateAPIView):
    # authentication_classes = [
    #     TokenAuthentication,
    #     SessionAuthentication,
    #     BasicAuthentication,
    # ]
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

    def post(self, request, *args, **kwargs):
        validated_data = request.data

        custodian_1 = validated_data.get("custodian_1")
        custodian_2 = validated_data.get("custodian_2")
        custodian_3 = validated_data.get("custodian_3")

        if custodian_1 and custodian_2 and custodian_1 == custodian_2:
            return Response(
                "!! ERR !!: The same custodian cannot be added more than once"
            )
        if custodian_1 and custodian_3 and custodian_1 == custodian_3:
            return Response(
                "!! ERR !!: The same custodian cannot be added more than once"
            )
        if custodian_3 and custodian_2 and custodian_3 == custodian_2:
            return Response(
                "!! ERR !!: The same custodian cannot be added more than once"
            )

        if not custodian_2:
            request.data["custodian_2"] = request.data["custodian_1"]
        if not custodian_3:
            request.data["custodian_3"] = request.data["custodian_1"]

        return self.create(request, *args, **kwargs)


class TripDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def put(self, request, *args, **kwargs):
        validated_data = request.data

        custodian_1 = validated_data.get("custodian_1")
        custodian_2 = validated_data.get("custodian_2")
        custodian_3 = validated_data.get("custodian_3")

        if custodian_1 and custodian_2 and custodian_1 == custodian_2:
            return Response(
                "!! ERR !!: The same custodian cannot be added more than once"
            )
        if custodian_1 and custodian_3 and custodian_1 == custodian_3:
            return Response(
                "!! ERR !!: The same custodian cannot be added more than once"
            )
        if custodian_3 and custodian_2 and custodian_3 == custodian_2:
            return Response(
                "!! ERR !!: The same custodian cannot be added more than once"
            )

        if not custodian_2:
            request.data["custodian_2"] = request.data["custodian_1"]
        if not custodian_3:
            request.data["custodian_3"] = request.data["custodian_1"]
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


class AttendanceList(generics.RetrieveUpdateDestroyAPIView):
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

    def get(self, request, *args, **kwargs):
        params = request.query_params
        start_date = params.get("start_date", datetime.min)
        end_date = params.get("end_date", datetime.max)

        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(entry_time__date__range=[
                                   start_date, end_date])

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        data = request.data
        branch_id = data.get("branch")
        added_by_id = data.get("added_by")
        custodian_ids = data.get("custodian_id")
        attendance_sheet = data.get("attendance_sheet")

        result = []

        for custodian_id in custodian_ids:
            data = {
                "custodian": custodian_id,
                "branch": branch_id,
                "added_by": added_by_id,
                "attendance_sheet": attendance_sheet,
            }
            new_attendance = AttendanceSerializer(data=data)
            if not new_attendance.is_valid():
                return Response(data="invalid request")

            today = datetime.now()
            attendance = Attendance.objects.filter(
                entry_time__year=today.date().year,
                entry_time__month=today.date().month,
                entry_time__day=today.date().day,
                custodian=new_attendance.data["custodian"]["id"],
                branch=new_attendance.data["branch"]["id"],
            ).first()

            if attendance:
                attendance.entry_time = today
                attendance.exit_time = new_attendance.data.get(
                    "exit_time", attendance.exit_time
                )
                attendance.save()
                result.append(AttendanceSerializer(attendance).data)
            else:
                custodian_ = get_object_or_404(
                    Custodian, pk=data.pop("custodian"))
                added_by_ = get_object_or_404(User, pk=data.pop("added_by"))
                branch_ = get_object_or_404(Branch, pk=data.pop("branch"))
                attendance_sheet_ = get_object_or_404(
                    AttendanceSheet, pk=data.pop("attendance_sheet")
                )
                attendance = Attendance(
                    custodian=custodian_,
                    added_by=added_by_,
                    branch=branch_,
                    attendance_sheet=attendance_sheet_,
                )
                attendance.save()
                result.append(AttendanceSerializer(attendance).data)

        return Response(data=result)


class AttendanceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer


class IssueList(generics.ListCreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    ordering_fields = "__all__"


class IssueDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
