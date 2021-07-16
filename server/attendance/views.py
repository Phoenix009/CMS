from datetime import datetime
from users.models import Branch
from django.shortcuts import render
from django.utils.translation import override
from rest_framework import mixins
from rest_framework import generics
from rest_framework.response import Response
from attendance.serializers import AttendanceSerializer, IssueSerializer
from attendance.models import Attendance, Issue
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from rest_framework.response import Response
from datetime import datetime

# from vendors.models import Gunmen
# from vendors.serializers import GunmenSerializer


class CustomPagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = "page_size"
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "count": self.page.paginator.count,
                "page_size": self.page_size,
                "results": data,
            }
        )


class AttendanceList(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    generics.GenericAPIView,
    # filters.FilterSet,
):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["^gunmen__first_name", "^gunmen__last_name"]
    
    filterset_fields = {
        "entry_time": ['gte', 'lte', 'exact', 'gt', 'lt'],
        "exit_time" : ['gte', 'lte', 'exact', 'gt', 'lt'],
        "gunmen"    : ["exact"],
        "added_by"  : ["exact"],
        "branch"    : ["exact"],
        "attendance_sheet": ["exact"],
    }
    
    ordering_fields = "__all__"

    def get(self, request, *args, **kwargs):
        params = request.query_params
        start_date = params.get('start_date', datetime.min)
        end_date = params.get('end_date', datetime.max)

        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(entry_time__date__range=[start_date, end_date])

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


    def post(self, request, *args, **kwargs):
        new_attendance = AttendanceSerializer(data=request.data)
        if not new_attendance.is_valid():
            return Response(data='invalid request')

        today = datetime.now()
        attendance = Attendance.objects.filter(
            entry_time__year=today.date().year,
            entry_time__month=today.date().month,
            entry_time__day=today.date().day,
            gunmen=new_attendance.data["gunmen"]["id"],
            branch=new_attendance.data["branch"]["id"],
        ).first()

        if attendance:
            attendance.entry_time = today
            attendance.exit_time = new_attendance.data.get("exit_time", attendance.exit_time)
            attendance.save()
            return Response(data=AttendanceSerializer(attendance).data)
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


class IssueList(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    pagination_class = CustomPagination
    ordering_fields = "__all__"

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class IssueDetail(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
