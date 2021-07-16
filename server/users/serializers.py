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
    # branch = RelatedFieldAlternative(queryset=Branch.objects.all())

    class Meta:
        model = Profile
        fields = ["id", "gender", "branch", "is_superuser", "is_incharge"]


class UserSerializer(serializers.ModelSerializer):
    # profile = RelatedFieldAlternative(
    #     queryset=Profile.objects.all(), serializer=ProfileSerializer
    # )
    profile = ProfileSerializer(required=False)
    # password = serializers.CharField(write_only=True, required=False)
    # confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "profile",
            "is_staff",
            "is_active",
            "is_superuser",
            "last_login",
            "date_joined",
        )
        # extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # password = validated_data.pop("password")
        profile_data = validated_data.pop("profile")
        user = User.objects.create(**validated_data)
        # user.set_password(password)
        profile = Profile.objects.create(user=user, **profile_data)
        profile.save()
        return user

    def update(self, instance, validated_data):
        if "first_name" in validated_data:
            instance.first_name = validated_data["first_name"]
        if "last_name" in validated_data:
            instance.last_name = validated_data["last_name"]
        if "email" in validated_data:
            instance.email = validated_data["email"]
        if "username" in validated_data:
            instance.username = validated_data["username"]
        profile = Profile.objects.filter(user=instance).first()
        if "profile" in validated_data:
            profile_data = validated_data.pop("profile")
            if profile:
                if "gender" in profile_data:
                    profile.gender = profile_data["gender"]
                if "branch" in profile_data:
                    profile.branch = profile_data["branch"]
                if "is_superuser" in profile_data:
                    profile.is_superuser = profile_data["is_superuser"]
                    if profile.is_superuser:
                        profile.is_incharge = profile.is_superuser
                if "is_incharge" in profile_data:
                    profile.is_incharge = profile_data["is_incharge"]
                    if profile.is_incharge == False:
                        profile.is_superuser = False
                profile.save()
            else:
                profile = Profile.objects.create(user=instance, **profile_data)
                profile.save()
        instance.save()
        return instance


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
