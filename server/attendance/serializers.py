from rest_framework import serializers

from vendors.serializers import VendorSerializer, GunmenSerializer
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    gunmen = GunmenSerializer()
    
    class Meta:
        model = Attendance
        fields = ['gunmen', 'entry_time', 'exit_time']

