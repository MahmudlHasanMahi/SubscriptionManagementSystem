from typing import Collection
from django.db import models,transaction,IntegrityError
from User.models import User,Client
from datetime import timedelta
from django.db.models.signals import post_save
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from .Mixins.subscriptionmixin import SubscriptionMixIn,SubscriptionPlanMixIn
class Representative(models.Model):

    name = models.CharField(max_length=64, unique=True, blank=False, verbose_name=_("Name"))
    client = models.ManyToManyField(
        Client, blank=True, related_name="Representative", verbose_name=_("Client"))
    
    def __str__(self):
        return self.name


class Period(models.Model):
    name    = models.CharField(max_length=20, unique=True, blank=False, null=False, verbose_name=_("Name"))
    days    = models.PositiveIntegerField(blank=False, null=False, default=7, verbose_name=_("days"))
    def __str__(self):
        return self.name


class PriceList(models.Model):
    period = models.ForeignKey(
        Period, blank=False, null=False, on_delete=models.CASCADE, verbose_name=_("period"))
    price = models.PositiveIntegerField(blank=False, default=30, verbose_name=_("price"))
    def __str__(self):
        return f"{self.period.name} - {self.price}"




class Product(models.Model):
    name = models.CharField(max_length=64, unique=True, blank=False, verbose_name=_("Name"))
    description = models.TextField(max_length=300,blank=True,null=True, verbose_name=_("Description")) 
    created_at = models.DateField(auto_now_add=True, verbose_name=_("Created_at"))
    price_list = models.ManyToManyField(PriceList,related_name="product_%(class)s_related", verbose_name=_("Price_list"))
    default_price = models.ForeignKey(PriceList,on_delete=models.PROTECT,blank=False,null=True, verbose_name=_("Price"))


            
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
        pass


class InvoiceStatus(models.TextChoices):
    ACTIVE      = 'DRAFT', _('Draft')
    DEACTIVE    = 'PAID', _('Paid')
    CANCELLED   = 'OVERDUE', _('Overdue')
    EXPIRED     = 'VOID', _('Void')
    PAUSED      = 'UNCOLLECTABLE', _('Uncollectable')
    

class Invoice(models.Model):
 

    # client = models.ForeignKey(
    #     Client, default=None, blank=False, on_delete=models.CASCADE, related_name="Invoice")
    # representative = models.ForeignKey(
    #     Representative, default=None, blank=False, on_delete=models.CASCADE, related_name="Invoice")
    subscription = models.ForeignKey(
        "Subscription", blank=False, null=False, on_delete=models.PROTECT, related_name="Invoice", verbose_name=_("Subscription"))

    status = models.CharField(max_length=15, choices=InvoiceStatus, default="Draft", verbose_name=_("Status"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))
    due_date = models.DateTimeField(editable=True, null=True, blank=True, verbose_name=_("Due_date"))


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

    def generate_invoice(self,commit: bool = False):
        with transaction.atomic():
            if self.is_active:
                invoice = Invoice(subscription=self)
                invoice.due_date = self.time_now + timedelta(hours=2,minutes=30)
                invoice.save()
                invoice_details = []
                subscription_plans  = self.subscription_plans.filter(status="ACTIVE") # pyright: ignore[reportAttributeAccessIssue]
                for plan in subscription_plans:
                    invoice_detail = InvoiceDetail(product = plan.product,quantity=plan.quantity,price=plan.price,invoice=invoice)
                    invoice_details.append(invoice_detail)
      
                # is_successfull = self.extend_renewal_date(commit=commit)
                # if is_successfull:
                InvoiceDetail.objects.bulk_create(invoice_details)
                # else:
                    # invoice.delete()
                


class InvoiceDetail(models.Model):
    product         =   models.ForeignKey(Product,null=False,blank=False, on_delete=models.PROTECT, verbose_name=_("Product"))
    quantity        =   models.PositiveIntegerField(default=1, verbose_name=_("Quantity"))
    price           =   models.ForeignKey(PriceList,null=False,blank=False,on_delete=models.PROTECT, verbose_name=_("Price"))
    invoice         =   models.ForeignKey(Invoice,null=False,blank=False,on_delete=models.PROTECT, verbose_name=_("Invoice"))