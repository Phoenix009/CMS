from datetime import datetime
from secrets import token_hex
from rest_framework import serializers
from rest_framework.response import Response
from users.serializers import BranchSerializer, UserSerializer
from vendors.serializers import (
    VendorSerializer,
    CustodianSerializer,
    VehicleSerializer,
)

from .models import Attendance, AttendanceSheet, AttendanceVehicle, Issue, Trip
from users.models import Branch, User
from vendors.models import Custodian, Vendor, Vehicle
from attendance.models import AttendanceVehicle


class RelatedFieldAlternative(serializers.PrimaryKeyRelatedField):
    def __init__(self, **kwargs):

        self.serializer = kwargs.pop("serializer", None)
        if self.serializer is not None and not issubclass(
            self.serializer, serializers.Serializer
        ):
            raise TypeError('"serializer" is not a valid serializer class')
        # if self.serializer:
        #     print(self.serializer)
        super().__init__(**kwargs)

    def use_pk_only_optimization(self):
        return False if self.serializer else True

    def to_representation(self, instance):
        if self.serializer:
            return self.serializer(instance, context=self.context).data
        return super().to_representation(instance)


class AttendanceSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSheet
        fields = ["id", "sheet_created", "invoice", "verified"]


class AttendanceVehicleSerializer(serializers.ModelSerializer):
    vehicle = RelatedFieldAlternative(
        queryset=Vehicle.objects.all(), serializer=VehicleSerializer
    )
    attendance_sheet = RelatedFieldAlternative(
        queryset=AttendanceSheet.objects.all(), serializer=AttendanceSheetSerializer
    )
    branch = RelatedFieldAlternative(
        queryset=Branch.objects.all(), serializer=BranchSerializer
    )
    added_by = RelatedFieldAlternative(
        queryset=User.objects.all(), serializer=UserSerializer
    )

    class Meta:
        model = AttendanceVehicle
        fields = [
            "id",
            "vehicle",
            "entry_time",
            "exit_time",
            "branch",
            "added_by",
            "attendance_sheet",
        ]
    




class AttendanceSerializer(serializers.ModelSerializer):
    custodian = RelatedFieldAlternative(
        queryset=Custodian.objects.all(), serializer=CustodianSerializer
    )
    attendance_sheet = RelatedFieldAlternative(
        queryset=AttendanceSheet.objects.all(), serializer=AttendanceSheetSerializer
    )
    branch = RelatedFieldAlternative(
        queryset=Branch.objects.all(), serializer=BranchSerializer
    )
    added_by = RelatedFieldAlternative(
        queryset=User.objects.all(), serializer=UserSerializer
    )

    class Meta:
        model = Attendance
        fields = [
            "id",
            "custodian",
            "entry_time",
            "exit_time",
            "branch",
            "added_by",
            "attendance_sheet",
        ]


class TripSerializer(serializers.ModelSerializer):
    vehicle = RelatedFieldAlternative(
        queryset=Vehicle.objects.all(), serializer=VehicleSerializer
    )
    custodian_1 = RelatedFieldAlternative(
        queryset=Custodian.objects.all(), serializer=CustodianSerializer
    )
    custodian_2 = RelatedFieldAlternative(
        queryset=Custodian.objects.all(), serializer=CustodianSerializer
    )
    custodian_3 = RelatedFieldAlternative(
        queryset=Custodian.objects.all(), serializer=CustodianSerializer
    )
    branch = RelatedFieldAlternative(
        queryset=Branch.objects.all(), serializer=BranchSerializer
    )
    added_by = RelatedFieldAlternative(
        queryset=User.objects.all(), serializer=UserSerializer
    )

    class Meta:
        model = Trip
        fields = [
            "id",
            "vehicle",
            "trip_code",
            "trip_start",
            "custodian_1",
            "custodian_2",
            "custodian_3",
            "custodian_1_code",
            "custodian_2_code",
            "custodian_3_code",
            "entry_time",
            "exit_time",
            "start_location",
            "end_location",
            "branch",
            "added_by",
        ]

    def create(self, validated_data):
        print(validated_data)
        validated_data["trip_code"] = token_hex(6).upper()

        custodian_1 = validated_data.get("custodian_1")
        custodian_2 = validated_data.get("custodian_2")
        custodian_3 = validated_data.get("custodian_3")

        if custodian_1:
            validated_data["custodian_1_code"] = token_hex(6).upper()
        if custodian_2 != custodian_2:
            validated_data["custodian_2_code"] = token_hex(6).upper()
        if custodian_3 != custodian_1:
            validated_data["custodian_3_code"] = token_hex(6).upper()

        return super().create(validated_data)

    def update(self, instance, validated_data):
        custodian_1 = validated_data.get("custodian_1")
        custodian_2 = validated_data.get("custodian_2")
        custodian_3 = validated_data.get("custodian_3")
        custodian_1_code = validated_data.get("custodian_1_code")
        custodian_2_code = validated_data.get("custodian_2_code")
        custodian_3_code = validated_data.get("custodian_3_code")
        trip_start = validated_data.get("trip_start")

        if not instance.trip_start:
            if custodian_1_code:
                if custodian_1_code != instance.custodian_1_code:
                    return serializers.ValidationError(
                        {"Error": "Code does not match !"}
                    )
                else:
                    Attendance.objects.create(
                        custodian=custodian_1,
                        branch=instance.branch,
                    )
                    AttendanceVehicle.objects.create(
                        vehicle=instance.vehicle,
                        branch=instance.branch,
                    )

            if custodian_2_code and custodian_2 != custodian_1:
                if custodian_2_code != instance.custodian_2_code:
                    return serializers.ValidationError(
                        {"error": "Code does not match !"}
                    )
                else:
                    Attendance.objects.create(
                        custodian=custodian_2,
                        branch=instance.branch,
                    )

            if custodian_3_code and custodian_3 != custodian_1:
                if custodian_3_code != instance.custodian_3_code:
                    return serializers.ValidationError(
                        {"error": "Code does not match !"}
                    )
                else:
                    Attendance.objects.create(
                        custodian=custodian_3,
                        branch=instance.branch,
                    )
        if instance.trip_start:
            today = datetime.now()
            attendance_1 = Attendance.objects.filter(
                entry_time__year=today.date().year,
                entry_time__month=today.date().month,
                entry_time__day=today.date().day,
                custodian=custodian_1,
                branch=instance.branch,
            ).first()
            attendance_2 = Attendance.objects.filter(
                entry_time__year=today.date().year,
                entry_time__month=today.date().month,
                entry_time__day=today.date().day,
                custodian=custodian_2,
                branch=instance.branch,
            ).first()
            attendance_3 = Attendance.objects.filter(
                entry_time__year=today.date().year,
                entry_time__month=today.date().month,
                entry_time__day=today.date().day,
                custodian=custodian_3,
                branch=instance.branch,
            ).first()
            vehicle_attendance = AttendanceVehicle.objects.filter(
                entry_time__year=today.date().year,
                entry_time__month=today.date().month,
                entry_time__day=today.date().day,
                vehicle=instance.vehicle,
                branch=instance.branch,
            ).first()
            if attendance_1:
                attendance_1.exit_time = today
                attendance_1.save()
            if attendance_2:
                attendance_2.exit_time = today
                attendance_2.save()
            if attendance_3:
                attendance_3.exit_time = today
                attendance_3.save()
            if vehicle_attendance:
                vehicle_attendance.exit_time = today
                vehicle_attendance.save()

        return super().update(instance, validated_data)


class IssueSerializer(serializers.ModelSerializer):
    reverted_by = RelatedFieldAlternative(
        queryset=User.objects.all(), serializer=UserSerializer
    )
    vendor = RelatedFieldAlternative(
        queryset=Vendor.objects.all(), serializer=VendorSerializer
    )
    sheet = RelatedFieldAlternative(
        queryset=AttendanceSheet.objects.all(), serializer=AttendanceSheetSerializer
    )

    class Meta:
        model = Issue
        fields = ["id", "comment", "reverted_by", "vendor", "sheet", "created_at"]

