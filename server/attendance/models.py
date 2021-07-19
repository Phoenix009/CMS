from django.db import models
from django.contrib.auth.models import User
from vendors.models import Vendor, Custodian, Vehicle
from users.models import Branch
from datetime import datetime

generate_token = lambda: token_hex(6).upper()

class Trip(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True)
    custodian_1 = models.ForeignKey(Custodian, on_delete=models.SET_NULL, null=True, blank=True)
    custodian_2 = models.ForeignKey(Custodian, on_delete=models.SET_NULL, null=True, blank=True)
    custodian_3 = models.ForeignKey(Custodian, on_delete=models.SET_NULL, null=True, blank=True)
    start_loc = models.DecimalField(max_digits=13, decimal_places=10, null=True, blank=True)
    end_loc = models.DecimalField(max_digits=13, decimal_places=10, null=True, blank=True)
    trip_code = models.CharField(max_length=6, default=generate_token)
    entry_time = models.DateTimeField(default=datetime.now)
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    exit_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.vehicle}: {self.custodian_1}, {self.custodian_2}, {self.custodian_3}"
















# class AttendanceSheet(models.Model):
#     sheet_created = models.DateField(default=datetime.now)
#     invoice = models.FileField(blank=True, null=True, upload_to="invoice")
#     verified = models.BooleanField(default=False)
# 
#     def __str__(self):
#         return f"{self.sheet_created} -> {self.verified}"
# 
# 
# class Attendance(models.Model):
#     entry_time = models.DateTimeField(default=datetime.now)
#     exit_time = models.DateTimeField(blank=True, null=True)
#     gunmen = models.ForeignKey(Gunmen, on_delete=models.SET_NULL, null=True, blank=True)
#     added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
#     branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
#     attendance_sheet = models.ForeignKey(
#         AttendanceSheet, on_delete=models.SET_NULL, null=True, blank=True
#     )
# 
#     def __str__(self):
#         return f"{self.gunmen.first_name} {self.gunmen.last_name}"
# 
# 
# class Issue(models.Model):
#     comment = models.CharField(max_length=200)
#     vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
#     reverted_by = models.ForeignKey(
#         User, on_delete=models.SET_NULL, null=True, blank=True
#     )
#     sheet = models.ForeignKey(
#         AttendanceSheet, on_delete=models.SET_NULL, null=True, blank=True
#     )
#     created_at = models.DateTimeField(default=datetime.now)
# 
#     def __str__(self) -> str:
#         return f"{self.comment} {self.vendor} {self.reverted_by} -> {self.sheet}"
# 