from django.contrib import admin
from django.contrib.admin import ModelAdmin
from .models import Client,Representative,Service,ServicesCategory,SubscriptionType,SubscriptionPlan,Subscription,Feature,Recipt
from django.contrib.sessions.models import Session 


class RepresentativeAdmin(admin.ModelAdmin):
    filter_horizontal = ("client",)


class ClientAdmin(admin.ModelAdmin):

    filter_horizontal = ("representative",)

class SubscriptionTypeAdmin(admin.ModelAdmin):
    model = SubscriptionType
    list_display=["type","__period__"]

class SubscriptionAdmin(admin.ModelAdmin):
    model = Subscription
    readonly_fields = ["created"]

class SubscriptionPlanAdmin(admin.ModelAdmin):
    model = SubscriptionPlan
    list_display = ["__str__","price"]
    filter_horizontal = ["feature"]

class FeatureAdmin(admin.ModelAdmin):
    model = Feature
    list_display = ["name","servicesCategory"]


admin.site.register(SubscriptionType,SubscriptionTypeAdmin)
admin.site.register(SubscriptionPlan,SubscriptionPlanAdmin)
admin.site.register(Subscription,SubscriptionAdmin)
admin.site.register(Client,ClientAdmin)
admin.site.register(Representative,RepresentativeAdmin)
admin.site.register(Feature,FeatureAdmin,)
admin.site.register((ServicesCategory,Service,Recipt,Session))

