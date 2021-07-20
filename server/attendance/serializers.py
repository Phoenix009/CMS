from secrets import token_hex

from rest_framework import serializers
from rest_framework.response import Response
from users.serializers import BranchSerializer, UserSerializer
from vendors.serializers import VendorSerializer, GunmenSerializer, CustodianSerializer, VehicleSerializer

from .models import Attendance, AttendanceSheet, Issue, Trip
from users.models import Branch, User
from vendors.models import Gunmen, Custodian, Vendor, Vehicle


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
        fields = ["id", "sheet_created", "invoice", "verified"]


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
            "id",
            "gunmen",
            "entry_time",
            "exit_time",
            "branch",
            "added_by",
            "attendance_sheet",
        ]


class TripSerializer(serializers.ModelSerializer):
    # vehicle = RelatedFieldAlternative(
    #     queryset=Vehicle.objects.all(), serializer=VehicleSerializer
    # )
    # custodian_1 = RelatedFieldAlternative(
    #     queryset=Custodian.objects.all(), serializer=CustodianSerializer
    # )
    # custodian_2 = RelatedFieldAlternative(
    #     queryset=Custodian.objects.all(), serializer=CustodianSerializer
    # )
    # custodian_3 = RelatedFieldAlternative(
    #     queryset=Custodian.objects.all(), serializer=CustodianSerializer
    # )
    # branch = RelatedFieldAlternative(
    #     queryset=Branch.objects.all(), serializer=BranchSerializer
    # )
    # added_by = RelatedFieldAlternative(
    #     queryset=User.objects.all(), serializer=UserSerializer
    # )
    vehicle = VehicleSerializer(required=False)
    custodian_1 =CustodianSerializer(required=False)
    custodian_2 = CustodianSerializer(required=False)
    custodian_3 = CustodianSerializer(required=False)
    branch = BranchSerializer(required=False)
    added_by = UserSerializer(required=False)

    class Meta:
        model = Trip
        fields = [
            "id",
            "vehicle",
            "custodian_1",
            "custodian_2",
            "custodian_3",
            "entry_time",
            "exit_time",
            "start_location",
            "end_location",
            "branch",
            "added_by",
        ]

    # def create(self, validated_data):
    #     validated_data['trip_code'] = token_hex(6).upper()
    
    #     custodian_1 = validated_data.get('custodian_1')
    #     custodian_2 = validated_data.get('custodian_2')
    #     custodian_3 = validated_data.get('custodian_3')

    #     if custodian_1 and custodian_2 and custodian_1 == custodian_2: return Response('!! ERR !!: The custodian ids cannot be same')
    #     if custodian_1 and custodian_3 and custodian_1 == custodian_3: return Response('!! ERR !!: The custodian ids cannot be same')
    #     if custodian_3 and custodian_2 and custodian_3 == custodian_2: return Response('!! ERR !!: The custodian ids cannot be same')
        
    #     if custodian_1: validated_data['custodian_1_code'] = token_hex(6).upper()
    #     if custodian_2: validated_data['custodian_2_code'] = token_hex(6).upper()
    #     if custodian_3: validated_data['custodian_3_code'] = token_hex(6).upper()

    #     return super().create(validated_data)
    
    # def update(self, instance, validated_data):
    #     return super().update(instance, validated_data)


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
