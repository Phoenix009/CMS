from attendance.models import Attendance, AttendanceVehicle
from attendance.utils import qs_to_local_csv
from django.conf import settings
import os
from datetime import datetime

BASE_DIR = settings.BASE_DIR


def send_attendance_report():
    qs1 = Attendance.objects.all()
    qs2 = AttendanceVehicle.objects.all()
    qs_to_local_csv(
        qs1,
        fields=[
            "id",
            "custodian__first_name",
            "custodian__last_name",
            "entry_time",
            "exit_time",
        ],
    )
    qs_to_local_csv(
        qs2,
        fields=[
            "id",
            "vehicle__model_name",
            "custodian__number_plate",
            "entry_time",
            "exit_time",
        ],
    )
