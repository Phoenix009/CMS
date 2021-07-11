from django.contrib import admin
from .models import Profile,Branch,Region

class BranchAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'address', 'branch_manager', 'region')
    list_display_links = ('id', 'name')
    search_fields = ('id', 'name', 'region', 'branch_manager')
    list_per_page = 20


class RegionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'address', 'regional_officer')
    list_display_links = ('id', 'name')
    search_fields = ('id', 'name', 'regional_officer')
    list_per_page = 20


admin.site.register(Branch, BranchAdmin)
admin.site.register(Region, RegionAdmin)
admin.site.register(Profile)