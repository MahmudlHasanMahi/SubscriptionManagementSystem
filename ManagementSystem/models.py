from django.db import models,transaction,IntegrityError
from django.utils import timezone
from User.models import User,Client
from django.dispatch import receiver
from datetime import datetime, timedelta
from django.db.models.signals import post_save
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from .Mixins.subscriptionmixin import SubscriptionMixIn,SubscriptionPlanMixIn

class Representative(models.Model):

    name = models.CharField(max_length=64, unique=True, blank=False)
    client = models.ManyToManyField(
        Client, blank=True, related_name="Representative")
    
    def __str__(self):
        return self.name


class Period(models.Model):
    name = models.CharField(max_length=20, unique=True, blank=False, null=False)
    days = models.PositiveIntegerField(blank=False, null=False, default=7)

    def __str__(self):
        return self.name


class PriceList(models.Model):
    period = models.ForeignKey(
        Period, blank=False, null=False, on_delete=models.CASCADE)
    price = models.PositiveIntegerField(blank=False, default=30)
    def __str__(self):
        return f"{self.period.name} - {self.price}"




class Product(models.Model):
    name = models.CharField(max_length=64, unique=True, blank=False)
    description = models.TextField(max_length=300,blank=True,null=True) 
    created_at = models.DateField(auto_now_add=True)
    price_list = models.ManyToManyField(PriceList,related_name="product_%(class)s_related")
    default_price = models.ForeignKey(PriceList,on_delete=models.PROTECT,blank=False,null=True)


            
    def __str__(self):
        return f"{self.name} - {self.default_price}"





# *********************
class SubscriptionPlan(SubscriptionPlanMixIn):

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)



    @classmethod
    def create_subscriptionPlan(cls,subscription,**subscription_plan):
        obj = cls(subscription=subscription,**subscription_plan)
        obj._validate_creation()
        # obj.save()
        return obj

    @classmethod 
    def create_bulk_subscriptionPlan(cls,subscription_plans):
        print(subscription_plans)


class Invoice(models.Model):
    STATUS = [
        ("DRAFT", "Draft"),
        ("PAID", "Paid"),
        ("OVERDUE", "Overdue"),
        ("VOID", "Void"),
        ("UNCOLLECTABLE", "Uncollectable"),
    ]

    # client = models.ForeignKey(
    #     Client, default=None, blank=False, on_delete=models.CASCADE, related_name="Invoice")
    # representative = models.ForeignKey(
    #     Representative, default=None, blank=False, on_delete=models.CASCADE, related_name="Invoice")
    subscription = models.ForeignKey(
        "Subscription", blank=False, null=False, on_delete=models.PROTECT, related_name="Invoice")

    status = models.CharField(max_length=15, choices=STATUS, default="Draft")
    created = models.DateField(auto_now_add=True)
    due_date = models.DateField(editable=True, null=True, blank=True)


class Subscription(SubscriptionMixIn):
    class Meta:
        permissions = [
            ("can_approve_subscription", "Can approve subscription"),
            ]

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
    
    @classmethod
    def create_subscrption(cls,**kwargs):
        subscription_plans = kwargs.pop("subscription_plans",[])
        if not subscription_plans:
            raise ValidationError(_("At least one subscription plan must be provided."))
            
        try:
            with transaction.atomic():
                subscription = cls(**kwargs)
                subscription._validate_creation()

                subscription.save()
                period = subscription_plans[0].get("price").period
                plans = []
                for plan in subscription_plans:
                    if not plan.get("price").period == period:
                        raise ValidationError(_("Subscription plans must have same period"))
                    obj = SubscriptionPlan.create_subscriptionPlan(subscription,**plan)
                    plans.append(obj)
                SubscriptionPlan.objects.bulk_create(plans)
                # subscription.generate_invoice()
                return subscription

        except IntegrityError:
            raise ValidationError(_("Failed to create subscription due to invalid or duplicate data."))

    def generate_invoice(self):
        with transaction.atomic():
            if self.is_active:
                invoice = Invoice(subscription=self)
                invoice.save()
                invoice_details = []
                for plan in self.subscription_plans.filter(status="ACTIVE"):
                    invoice_detail = InvoiceDetail(product = plan.product,quantity=plan.quantity,price=plan.price,invoice=invoice)
                    invoice_details.append(invoice_detail)
                InvoiceDetail.objects.bulk_create(invoice_details)

                    



class InvoiceDetail(models.Model):
    product         =   models.ForeignKey(Product,null=False,blank=False, on_delete=models.PROTECT)
    quantity        =   models.PositiveIntegerField(default=1)
    price           =   models.ForeignKey(PriceList,null=False,blank=False,on_delete=models.PROTECT)
    invoice         =   models.ForeignKey(Invoice,null=False,blank=False,on_delete=models.PROTECT)