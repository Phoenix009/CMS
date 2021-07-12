from django.db import models
from django.contrib.auth.models import User


# Create your models here.


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_superuser = models.BooleanField(default=False)
    is_incharge = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} Profile"


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
