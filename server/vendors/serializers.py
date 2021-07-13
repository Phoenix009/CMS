from rest_framework import serializers
from .models import Vendor, Gunmen

class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['name', 'address','email','contact','officer_incharge', 'created_by', 'created_at']


class GunmenSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer()
    class Meta:
        model = Gunmen
        fields = ['first_name', 'last_name', 'vendor']

