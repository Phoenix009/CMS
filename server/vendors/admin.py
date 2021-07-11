from django.contrib import admin
from django.db import models

from .models import Vendor

class VendorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name','address','email', 'contact', 'officer_incharge', 'created_at')
    list_display_links = ('id', 'name')
    search_fields = ('id', 'name', 'email', 'officer_incharge')
    list_per_page = 20

admin.site.register(Vendor, VendorAdmin)

