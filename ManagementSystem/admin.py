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


class SubscriptionPlanAdmin(admin.StackedInline):
    extra=0
    model = SubscriptionPlan


class SubscriptionAdmin(admin.ModelAdmin):
    inlines = [SubscriptionPlanAdmin]
    model = Subscription
    list_display=["id","client","begin","end","status"]

    
class InvoiceAdmin(admin.ModelAdmin):
    model = Invoice
    list_display = ["id","client","status","created","due_date"]
    
class ProductAdmin(admin.ModelAdmin):
    model = Product
    list_display=["id","name","default_price"]
    filter_horizontal=("price_list",)

    readonly_fields=["created_at"]


admin.site.register(Product,ProductAdmin)
admin.site.register(SubscriptionPlan)
admin.site.register(Period,PeriodAdmin)
admin.site.register(Client,ClientAdmin)
admin.site.register(Invoice,InvoiceAdmin)
admin.site.register(PriceList,PriceListAdmin)
admin.site.register(Subscription,SubscriptionAdmin)
admin.site.register(Representative,RepresentativeAdmin)
# admin.site.register(SubscriptionPlan,SubscriptionPlanAdmin)


