from attendance.models import Attendance, AttendanceVehicle
from vendors.models import Vendor
from attendance.utils import qs_to_local_csv
from django.conf import settings
from datetime import datetime

from django.core.mail import EmailMessage

BASE_DIR = settings.BASE_DIR


def send_attendance_report():
    today = datetime.today()

    for vendor in Vendor.objects.all():
        attendance_custodian = Attendance.objects.filter(
            custodian__vendor = vendor,
            entry_time__month = today.month,
            entry_time__year = today.year,
        ).order_by('entry_time').all()
        
        if attendance_custodian:
            attendance_custodian_path = qs_to_local_csv(
                attendance_custodian,
                fields=[
                    "id",
                    "custodian__first_name",
                    "custodian__last_name",
                    "entry_time",
                    "exit_time",
                ],
            )

            mail = EmailMessage(
                subject= f"Monthly Custodian Attendance Report: {today.strftime('%B %Y')}",
                body= f"PFA the attendance reports for the custodians for {today.strftime('%B %Y')}",
                from_email= settings.EMAIL_HOST_USER,
                to=[vendor.email]
            )

            attendance_file = open(attendance_custodian_path)
            mail.attach(f"attendance_report_{ today.strftime('%B_%Y') }.csv", attendance_file.read())
            mail.send()
        

        attendance_vehicle = AttendanceVehicle.objects.filter(
            custodian__vendor = vendor,
            entry_time__month = today.month,
            entry_time__year = today.year,
        ).order_by('entry_time').all()

        if attendance_vehicle:
            attendance_vehicle_path = qs_to_local_csv(
                attendance_vehicle,
                fields=[
                    "id",
                    "vehicle__model_name",
                    "custodian__number_plate",
                    "entry_time",
                    "exit_time",
                ],
            )

            mail = EmailMessage(
                subject= f"Monthly Vehicle Attendance Report: {today.strftime('%B %Y')}",
                body= f"PFA the attendance reports for the vehicles for {today.strftime('%B %Y')}",
                from_email= settings.EMAIL_HOST_USER,
                to=[vendor.email]
            )

            attendance_file = open(attendance_vehicle_path)
            mail.attach(attendance_file.name, attendance_file.read())
            mail.send()
