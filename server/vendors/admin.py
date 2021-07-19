from django.contrib import admin
from .models import *


class VendorAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "address",
        "email",
        "contact",
        "officer_incharge",
        "created_at",
    )
    list_display_links = ("id", "name")
    search_fields = ("id", "name", "email", "officer_incharge")
    list_per_page = 20


class CustodianAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name", "custodian_type", "email", "phone_number", "vendor")
    list_display_links = ("id", "vendor", "custodian_type")
    search_fields = ("first_name", "last_name", "vendor", "custodian_type")
    list_per_page = 20



class VehicleAdmin(admin.ModelAdmin):
    list_display = ("id", "model_name", "number_plate", "vendor")
    list_display_links = ("vendor",)
    search_fields = ("id", "model_name", "vendor", "number_plate")
    list_per_page = 20

admin.site.register(Custodian, CustodianAdmin)
admin.site.register(Vendor, VendorAdmin)
admin.site.register(Vehicle, VehicleAdmin)
