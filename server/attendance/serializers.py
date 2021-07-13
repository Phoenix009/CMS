from django.contrib.auth.models import User
from users.models import Branch
from vendors.models import Gunmen
from django.db.models import fields
from rest_framework import serializers
from users.serializers import BranchSerializer, UserSerializer
from vendors.serializers import VendorSerializer, GunmenSerializer
from .models import Attendance, AttendanceSheet, Issue


class RelatedFieldAlternative(serializers.PrimaryKeyRelatedField):
    def __init__(self, **kwargs):
        self.serializer = kwargs.pop("serializer", None)
        if self.serializer is not None and not issubclass(
            self.serializer, serializers.Serializer
        ):
            raise TypeError('"serializer" is not a valid serializer class')
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
        fields = ["sheet_created", "invoice", "verified"]
 

class AttendanceSerializer(serializers.ModelSerializer):
    gunmen = RelatedFieldAlternative(
        queryset=Gunmen.objects.all(), serializer=GunmenSerializer
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
