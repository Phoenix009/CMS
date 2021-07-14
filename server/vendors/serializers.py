from rest_framework import serializers
from .models import Vehicle, Vendor, Gunmen


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


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = [
            "id",
            "name",
            "address",
            "email",
            "contact",
            "officer_incharge",
            "created_by",
            "created_at",
        ]


class GunmenSerializer(serializers.ModelSerializer):
    vendor = RelatedFieldAlternative(
        queryset=Vendor.objects.all(), serializer=VendorSerializer
    )

    class Meta:
        model = Gunmen
        fields = ["id", "first_name", "last_name", "email", "vendor"]


class VehicleSerializer(serializers.ModelSerializer):
    vendor = RelatedFieldAlternative(
        queryset=Vendor.objects.all(), serializer=VendorSerializer
    )

    class Meta:
        model = Vehicle
        fields = ["id", "model_name", "number_plate", "vendor"]