from django.contrib import admin

from .models import * 

class AttendanceSheetAdmin(admin.ModelAdmin):
    list_display = ('id', 'sheet_created')
    list_display_links = ('id', 'sheet_created')
    list_per_page = 20

class GunmenAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name','last_name', 'vendor')
    list_display_links = ('id', 'vendor')
    search_fields = ('first_name', 'last_name', 'vendor')
    list_per_page = 20 

class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'gunmen','entry_time', 'exit_time', 'branch_id')
    list_display_links = ('id', 'gunmen')
    search_fields = ('gunmen',)
    list_per_page = 20 

class IssueAdmin(admin.ModelAdmin):
    list_display = ('id', 'comment', 'vendor', 'reverted_by', 'sheet', 'created_at')
    list_display_links = ('id','comment')
    list_per_page = 20 

admin.site.register(Attendance, AttendanceAdmin)
admin.site.register(AttendanceSheet, AttendanceSheetAdmin)
admin.site.register(Issue, IssueAdmin)
admin.site.register(Gunmen, GunmenAdmin)
