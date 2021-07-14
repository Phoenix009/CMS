from datetime import datetime
from users.models import Branch
from django.shortcuts import render
from django.utils.translation import override
from rest_framework import mixins
from rest_framework import generics
from rest_framework.response import Response
from attendance.serializers import AttendanceSerializer
from attendance.models import Attendance

# from vendors.models import Gunmen
# from vendors.serializers import GunmenSerializer
from rest_framework import filters


class AttendanceList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        new_attendance = AttendanceSerializer(data=request.data)
        if new_attendance.is_valid():
            today = datetime.now()
            attendance = Attendance.objects.filter(
                entry_time__year =today.date().year,
                entry_time__month =today.date().month,
                entry_time__day =today.date().day,
                gunmen = new_attendance.data['gunmen']['id'],
                branch = new_attendance.data['branch']['id']
            ).first()

            if attendance:
                attendance.entry_time = today
                if 'exit_time' in new_attendance.data:
                    attendance.exit_time = new_attendance.data.get('exit_time')
                attendance.save()
                return Response(data = AttendanceSerializer(attendance).data)
            else:
                return self.create(request, *args, **kwargs)


class AttendanceDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)



        # today = date.today()
        # attendance = Attendance.objects.filter(
        #     entry_time__year =today.year,
        #     entry_time__month =today.month,
        #     entry_time__day =today.day,
        # ).first()


        # print(attendance)

        # if attendance:
        #     new_attendance = AttendanceSerializer(request.data)
        #     if new_attendance.is_valid():
        #         attendance
        #     attendance.save()
        # else:
