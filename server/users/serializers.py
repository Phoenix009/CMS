from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Region, Branch


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "username", "email")


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["user", "is_superuser", "is_incharge"]


class RegionSerializer(serializers.ModelSerializer):
    regional_officer = UserSerializer()

    class Meta:
        model = Region
        fields = ["name", "address", "regional_officer"]


class BranchSerializer(serializers.ModelSerializer):
    branch_manager = UserSerializer()
    region = RegionSerializer()

    class Meta:
        model = Branch
        fields = ["name", "address", "branch_manager", "region"]
