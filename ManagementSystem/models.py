from django.db import models,transaction,IntegrityError
from User.models import Client
from datetime import timedelta
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from .Mixins.subscriptionmixin import SubscriptionMixIn,SubscriptionPlanMixIn
from .Mixins.Enum import InvoiceStatus
from django.utils import timezone
from .Mixins.Invoice_mixin import InvoiceMixIn
from .Mixins.CustomManager import InvoiceManager
import os

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


class Currency(models.Model):
    code = models.CharField(max_length=5, unique=True)   # USD, SAR, EUR
    name = models.CharField(max_length=50, null=True, blank=True)  # US Dollar
    native_name = models.CharField(max_length=50, null=True, blank=True)  # ريال سعودي
    symbol = models.CharField(max_length=10, null=True, blank=True)  # $, ر.س

    SYMBOL_POSITION = (
        ('before', 'Before'),
        ('after', 'After'),
    )
    symbol_position = models.CharField(max_length=6, choices=SYMBOL_POSITION, default='before')


    class Meta:
        verbose_name = "Currency"
        verbose_name_plural = "Currencies"

    def __str__(self):
        return f"{self.code} ({self.symbol})"

    



class PriceList(models.Model):
    period = models.ForeignKey(
        Period, blank=False, null=False, on_delete=models.CASCADE, verbose_name=_("period"))
    price = models.PositiveIntegerField(blank=False, default=30, verbose_name=_("price"))
    currency = models.ForeignKey(Currency,on_delete=models.SET_NULL,blank=True,null=True,verbose_name=_("currency"))


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

# finalize invoice after a day
def default_finalize_date():
    return timezone.now() + timedelta(days=1)

class Invoice(InvoiceMixIn):
 
    objects = InvoiceManager()
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._after_save_queue = []

    client = models.ForeignKey(
        Client,blank=True,null=True, on_delete=models.CASCADE, related_name="Invoice")
    # representative = models.ForeignKey(
    #     Representative, default=None, blank=False, on_delete=models.CASCADE, related_name="Invoice")
    subscription = models.ForeignKey(
        "Subscription", blank=True, null=True, on_delete=models.PROTECT, related_name="Invoice", verbose_name=_("Subscription"))

    status = models.CharField(max_length=15, choices=InvoiceStatus, default="DRAFT", verbose_name=_("Status"))
    created = models.DateTimeField(auto_now_add=True, verbose_name=_("Created"))
    due_date = models.DateTimeField(editable=True, null=True, blank=True, verbose_name=_("Due date"))
    finalize_date = models.DateTimeField(editable=True,null=False,blank=False,default=default_finalize_date,verbose_name=("Finalize date"))
    paid_date = models.DateTimeField(editable=True,null=True,blank=True,verbose_name=_("Payment Date"))

    # requires seperate worker to offload this task 
    @classmethod
    def create_invoice(cls,notify=False,**kwargs):   

        invoice_details = kwargs.pop("invoice_detail",[])
        subscription = kwargs.pop("subscription",False)

        if subscription:
            subscription = Subscription.objects.get(pk=subscription)

            invoice_details = (subscription.subscription_plans
                    .filter(status="ACTIVE")
                    .select_related("product")
                    .values("product","quantity","price")
                    )

    

        if not (invoice_details or subscription):
            raise ValidationError(_("At least one invoice details must be provided."))
        try:
            with transaction.atomic():   
                invoice = cls(**kwargs)
                invoice.save()

                invoice_details_object = []
                for invoice_detail in invoice_details:
                    print(invoice_detail)
                    obj = InvoiceDetail(**invoice_detail,invoice=invoice)
                    invoice_details_object.append(obj)           
                InvoiceDetail.objects.bulk_create(invoice_details_object)

            if notify:
                invoice.add_to_aftersave_tasks(invoice.notify_paid)
                invoice._run_after_save_queue()

            

        except IntegrityError:
            raise ValidationError(_("Failed to create invoice due to invalid or duplicate data."))

        return 
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self._run_after_save_queue()

class Subscription(SubscriptionMixIn):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._invoice = {
            "generate":False,
            "notify":False,
        }
        self._after_save_queue = []

    def invoice(self,generate:bool,notify=False):
        self._invoice.update({"generate":generate,"notify":notify})


    class Meta:
        permissions = [
            ("can_approve_subscription", "Can approve subscription"),
            ]




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
                created_by = subscription.created_by
                if created_by.has_perm("ManagementSystem.can_approve_subscription"):
                    subscription.approve(created_by,commit=True)

                # subscription.generate_invoice()
            return subscription

        except IntegrityError:
            raise ValidationError(_("Failed to create subscription due to invalid or duplicate data."))

    def generate_invoice(self,commit: bool = False,notify: bool=False):
        obj = {
            "subscription":self.pk,
            "client":self.client,
            "notify":notify,
        }
        from .tasks import generate_invoice
        generate_invoice(**obj)

    

    # def save(self, *args, **kwargs):
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self._run_after_save_queue()

        if self._invoice.get("generate"):
            self.generate_invoice()
        
                


class InvoiceDetail(models.Model):
    product         =   models.ForeignKey(Product,null=False,blank=False, on_delete=models.PROTECT, verbose_name=_("Product"))
    quantity        =   models.PositiveIntegerField(default=1,verbose_name=_("Quantity"))
    price           =   models.ForeignKey(PriceList,null=False,blank=False,on_delete=models.PROTECT, verbose_name=_("Price"))
    invoice         =   models.ForeignKey(Invoice,null=False,blank=False,on_delete=models.PROTECT, verbose_name=_("Invoice"),related_name="invoice_detail")






