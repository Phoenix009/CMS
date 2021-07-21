from attendance.models import Attendance
from attendance.utils import qs_to_local_csv
from django.conf import settings
import os
from datetime import datetime

BASE_DIR = settings.BASE_DIR


def send_attendance_report():
    qs = Attendance.objects.all()
    qs_to_local_csv(
        qs, 
        fields=['id', 'custodian__first_name', 'custodian__last_name', 'entry_time', 'exit_time'])

