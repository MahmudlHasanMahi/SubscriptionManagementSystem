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
    list_display=["__str__","Days","price"]
    def Days(self,args):
        return args.period.days * args.unit_period
    

class SubscriptionAdmin(admin.ModelAdmin):
    model = Subscription
    filter_horizontal=["active_plans","deactive_plans"]
    list_display=["id","begin","end"]
    # readonly_fields = ["start"]

class SubscriptionPlanAdmin(admin.ModelAdmin):
    model = SubscriptionPlan
    list_display = ["__str__"]
    # filter_horizontal = ["feature"]
    
class InvoiceAdmin(admin.ModelAdmin):
    model = Invoice
    list_display = ["client","status","created","due_date"]
    


admin.site.register(PriceList,PriceListAdmin)
admin.site.register(SubscriptionPlan,SubscriptionPlanAdmin)
admin.site.register(Subscription,SubscriptionAdmin)
admin.site.register(Client,ClientAdmin)
admin.site.register(Representative,RepresentativeAdmin)
admin.site.register(Period,PeriodAdmin)
admin.site.register(Invoice,InvoiceAdmin)
admin.site.register((ServicesCategory,Service,Session))

