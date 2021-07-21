from django.contrib import admin

from .models import *


class TripAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "vehicle",
        "custodian_1",
        "custodian_2",
        "custodian_3",
        "entry_time",
        "exit_time",
        "start_location",
        "end_location",
        "branch_id",
        "added_by",
    )
    list_display_links = ("id", "custodian_1", "custodian_2", "custodian_3")
    search_fields = ("id", "vehicle", "custodian_1", "custodian_2", "custodian_3")
    list_per_page = 20


class AttendanceSheetAdmin(admin.ModelAdmin):
    list_display = ("id", "sheet_created")
    list_display_links = ("id", "sheet_created")
    list_per_page = 20


class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("id", "custodian", "entry_time", "exit_time", "branch_id")
    list_display_links = ("id", "custodian")
    search_fields = ("custodian",)
    list_per_page = 20


class AttendanceVehicleAdmin(admin.ModelAdmin):
    list_display = ("id", "vehicle", "entry_time", "exit_time", "branch_id")
    list_display_links = ("id", "vehicle")
    search_fields = ("vehicle",)
    list_per_page = 20


class IssueAdmin(admin.ModelAdmin):
    list_display = ("id", "comment", "vendor", "reverted_by", "sheet", "created_at")
    list_display_links = ("id", "comment")
    list_per_page = 20


admin.site.register(Attendance, AttendanceAdmin)
admin.site.register(AttendanceVehicle, AttendanceVehicleAdmin)
admin.site.register(Trip, TripAdmin)
admin.site.register(AttendanceSheet, AttendanceSheetAdmin)
admin.site.register(Issue, IssueAdmin)
