from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.


class Region(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=1000)
    regional_officer = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self):
        return f"{self.name}"


class Branch(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=1000)
    branch_manager = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name} -> {self.region}"


class Profile(models.Model):
    GENDER_CHOICES = (
        ("M", "Male"),
        ("F", "Female"),
        ("O", "Other"),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    is_superuser = models.BooleanField(default=False)
    is_incharge = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} Profile"
