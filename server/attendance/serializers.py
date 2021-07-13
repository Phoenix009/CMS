from django.db.models import fields
from rest_framework import serializers
from users.serializers import BranchSerializer, UserSerializer
from vendors.serializers import VendorSerializer, GunmenSerializer
from .models import Attendance, AttendanceSheet, Issue


class AttendanceSheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSheet
        fields = ["sheet_created", "invoice", "verified"]
 

class AttendanceSerializer(serializers.ModelSerializer):
    gunmen = GunmenSerializer()
    attendance_sheet = AttendanceSheetSerializer()
    branch = BranchSerializer()
    added_by = UserSerializer()

    class Meta:
        model = Attendance
        fields = [
            "gunmen",
            "entry_time",
            "exit_time",
            "branch",
            "added_by",
            "attendance_sheet",
        ]


class IssueSerializer(serializers.ModelSerializer):
    reverted_by = UserSerializer()
    vendor = VendorSerializer()
    sheet = AttendanceSheetSerializer()

    class Meta:
        model = Issue
        fields = ["comment", "reverted_by", "vendor", "sheet", "created_at"]
