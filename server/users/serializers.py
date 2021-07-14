from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, Region, Branch


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


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["user", "is_superuser", "is_incharge"]


class UserSerializer(serializers.ModelSerializer):
    profile = RelatedFieldAlternative(
        queryset=Profile.objects.all(), serializer=ProfileSerializer
    )
    class Meta:
        model = User
        fields = (
            "id", "first_name", "last_name", 
            "username", "email", 'profile', 
            'is_staff', 'is_active', 'is_superuser', 
            'last_login', 'date_joined'
        )


class RegionSerializer(serializers.ModelSerializer):
    regional_officer = RelatedFieldAlternative(
        queryset=User.objects.all(), serializer=UserSerializer
    )

    class Meta:
        model = Region
        fields = ["id", "name", "address", "regional_officer"]


class BranchSerializer(serializers.ModelSerializer):
    branch_manager = RelatedFieldAlternative(
        queryset=User.objects.all(), serializer=UserSerializer
    )
    region = RelatedFieldAlternative(
        queryset=Region.objects.all(), serializer=RegionSerializer
    )

    class Meta:
        model = Branch
        fields = ["id", "name", "address", "branch_manager", "region"]
