from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username', 'email')


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = []

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ('branch_name','address','branch_manager','region_id' )


