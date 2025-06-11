from django.contrib import admin
from django.contrib.admin import ModelAdmin
from .models import *
from django.contrib.sessions.models import Session 


class RepresentativeAdmin(admin.ModelAdmin):
    filter_horizontal = ("client",)


class ClientAdmin(admin.ModelAdmin):
    filter_horizontal = ("representative",)

class PeriodAdmin(admin.ModelAdmin):
    model = Period
    list_display=["name","days"]

class PriceListAdmin(admin.ModelAdmin):
    model = PriceList
    list_display=["__str__","price"]

# class PlanAdmin(admin.ModelAdmin):
#     model = Plan
#     list_display = ["__str__"]

class SubscriptionPlanAdmin(admin.ModelAdmin):
    model = SubscriptionPlan
    list_display = ["status"]


class SubscriptionAdmin(admin.ModelAdmin):
    model = Subscription
    list_display=["client","begin","end"]

    
class InvoiceAdmin(admin.ModelAdmin):
    model = Invoice
    list_display = ["client","status","created","due_date"]
    
class ProductAdmin(admin.ModelAdmin):
    model = Product
    list_display=["name"]
    filter_horizontal=("price_list",)

    readonly_fields=["created_at"]


admin.site.register(Product,ProductAdmin)
# admin.site.register(Plan,PlanAdmin)
admin.site.register(Period,PeriodAdmin)
admin.site.register(Client,ClientAdmin)
admin.site.register(Invoice,InvoiceAdmin)
admin.site.register(PriceList,PriceListAdmin)
admin.site.register(Subscription,SubscriptionAdmin)
admin.site.register(Representative,RepresentativeAdmin)
admin.site.register(SubscriptionPlan,SubscriptionPlanAdmin)


