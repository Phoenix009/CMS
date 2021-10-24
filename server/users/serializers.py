from secrets import token_hex
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from .models import Profile, Region, Branch


class RelatedFieldAlternative(serializers.PrimaryKeyRelatedField):
    """
        Used to serialize the primary key related field
        If serializer is passed then the instance related with the pk is serialized
        Else only the pk of the field is sent
    """

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
    branch = RelatedFieldAlternative(queryset=Branch.objects.all())

    class Meta:
        model = Profile
        fields = ["id", "gender", "branch", "is_superuser", "is_incharge"]


class UserSerializer(serializers.ModelSerializer):
    profile = RelatedFieldAlternative(
        queryset=Profile.objects.all(), serializer=ProfileSerializer
    )

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
        profile_data = validated_data.pop("profile")
        random_password = token_hex(6).upper()
        encoded_password = make_password(random_password)

        user = User.objects.create(**validated_data, password=encoded_password)
        Profile.objects.create(user=user, **profile_data)

        # mail(
        #     subject='CMS Login Credentials',
        #     message=f'Username: {user.username} Password: {random_password}',
        #     to_mail= [user.email],
        # )

        return user

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get(
            "first_name", instance.first_name)
        instance.last_name = validated_data.get(
            "last_name", instance.last_name)
        instance.email = validated_data.get("email", instance.email)
        instance.username = validated_data.get("username", instance.username)

        profile = Profile.objects.filter(user=instance).first()
        profile_data = validated_data.pop("profile")
        if profile:
            profile.gender = profile_data.get("gender", profile.gender)
            profile.branch = profile_data.get("branch", profile.branch)
            profile.is_superuser = profile_data.get(
                "is_superuser", profile.is_superuser
            )
            profile.is_incharge = profile_data.get(
                "is_incharge", profile.is_incharge)
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
