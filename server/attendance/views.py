from django.shortcuts import render
from rest_framework import mixins
from rest_framework import generics
from attendance.serializers import AttendanceSerializer
from attendance.models import Attendance
from vendors.models import Gunmen
from vendors.serializers import GunmenSerializer


class AttendanceList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
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
