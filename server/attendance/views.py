from django.shortcuts import render
from rest_framework import mixins
from rest_framework import generics
from attendance.serializers import AttendanceSerializer
from attendance.models import Attendance

# Create your views here.

# ListView for Gunmen
class GunmenList(generics.ListAPIView):
    serializer_class = GunmenSerializer
    queryset = Gunmen.objects.all()


class AttendanceList(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    queryset = Attendance.objects.all()


    
# ListView for Vehicles


