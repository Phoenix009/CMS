from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from datetime import datetime


class Vendor(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=1000)
    email = models.EmailField()
    contact = models.CharField(max_length=20)
    officer_incharge = models.CharField(max_length=100)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True
    )
    created_at = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f"{self.name} -> {self.email}"


class Custodian(models.Model):
    CUSTODIAN_TYPE_CHOICES = [("C", "Custodian"), ("G", "Gunmen")]
    custodian_type = models.CharField(
        max_length=1, default="C", choices=CUSTODIAN_TYPE_CHOICES
    )

    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)

    email = models.EmailField()
    phone_regex = RegexValidator(
        regex=r"^\+?1?\d{9,15}$",
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.",
    )
    phone_number = models.CharField(
        validators=[phone_regex], max_length=17, blank=True)

    vendor = models.ForeignKey(
        Vendor, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.custodian_type}: {self.first_name} {self.last_name}"


class Vehicle(models.Model):
    model_name = models.CharField(max_length=200)
    number_plate = models.CharField(max_length=200)
    vendor = models.ForeignKey(
        Vendor, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.model_name} -> {self.number_plate}"


class Gunmen(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField()
    vendor = models.ForeignKey(
        Vendor, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"
