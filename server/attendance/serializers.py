from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ('first_name', 'last_name', 'entry_time', 'exit_time', 'vendor')

    # first_name = models.CharField(max_length=200)
    # last_name = models.CharField(max_length=200)
    # entry_time = models.DateTimeField(default=datetime.now)
    # exit_time = mod:wq
    # els.DateTimeField(blank=True,null=True)
    # vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
    # added_by = models.ForeignKey(User, on_delete=models.SET_NULL,null=True, blank=True)
    # branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True)
    # attendance_sheet = models.ForeignKey(AttendanceSheet, on_delete=models.SET_NULL, null=True, blank=True)
