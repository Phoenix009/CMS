from django.contrib import admin

from .models import * 

class AttendanceSheetAdmin(admin.ModelAdmin):
    list_display = ('id', 'sheet_created')
    list_display_links = ('id', 'sheet_created')
    list_per_page = 20


class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name','entry_time', 'exit_time', 'vendor', 'branch_id')
    list_display_links = ('id', 'first_name', 'last_name')
    search_fields = ('first_name', 'last_name','vendor')
    list_per_page = 20 

class IssueAdmin(admin.ModelAdmin):
    list_display = ('id', 'comment', 'vendor', 'reverted_by', 'sheet', 'created_at')
    list_display_links = ('id','comment')
    list_per_page = 20 

admin.site.register(Attendance, AttendanceAdmin)
admin.site.register(AttendanceSheet, AttendanceSheetAdmin)
admin.site.register(Issue, IssueAdmin)
