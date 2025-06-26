from django.db import models
from datetime import datetime, timedelta
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from User.models import User
class Client(models.Model):
    client = models.CharField(max_length=64, blank=False)
    address = models.CharField(max_length=1024, blank=False)
    representative = models.ManyToManyField(
        "Representative", blank=True, related_name="Client")

    class Meta:
        verbose_name_plural = "Clients"

    def __str__(self):
        return self.client


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
class SubscriptionPlan(models.Model):
    STATUS = [
        ("ACTIVE", "Active"),
        ("CANCELLED", "Cancelled"),
        ("DEACTIVE", "Deactive"),
        ("EXPIRED", "Expired"),
    ]
    product = models.ForeignKey(Product,default=None,related_name="subscription_plan_%(class)s_related",on_delete=models.PROTECT)
    status = models.CharField(max_length=15, choices=STATUS, default="DEACTIVE")
    subscription = models.ForeignKey(
        "Subscription", null=False, blank=False, on_delete=models.PROTECT, related_name="subscription_plans")
    quantity = models.PositiveIntegerField(default=1)
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

class Subscription(models.Model):

    STATUS = [
        ("SCHEDULED","Scheduled"),
        ("PENDING","Pending"),
        ("ACTIVE", "Active"),
        ("DEACTIVE", "Deactive"),
        ("CANCELLED", "Cancelled"),
        ("EXPIRED", "Expired"),
        ("REJECTED","Rejected")
    ]

    client = models.ForeignKey(
        Client, null=True, on_delete=models.PROTECT, related_name="Subscription")
    begin = models.DateTimeField(
        null=True, default=datetime.now, editable=True)
    end = models.DateTimeField(null=True, blank=True, editable=True)
    status = models.CharField(max_length=15, choices=STATUS, default="DEACTIVE")
    approved = models.BooleanField(default=False,blank=False)
    rejected_by = models.ForeignKey(User,blank=True,null=True,on_delete=models.PROTECT)

    def activate_subscription(self):
        if self.approved and self.status == "ACTIVE":
            raise ValidationError("Subscription is already active or have not been approved")
        if self.status in ["CANCELLED", "REJECTED", "EXPIRED"]:
            raise ValidationError(f"Cannot activate plans because subscription is {self.status.lower()}.")
        self.status = "ACTIVE"
        self.subscription_plans.update(status="ACTIVE")
        self.save(update_fields=['status'])


    def _validate_creation_status(self):
        not_allowed_status = ["EXPIRED","DEACTIVE","CANCELLED","REJECTED"]
        if self.status in not_allowed_status:
            raise ValidationError(f"Cannot set {self.status} during creation of Subscription") 
        

    def _update_plans_status(self):

        if self.approved and self.status == "ACTIVE":
            subscription_plans = self.subscription_plans.all()
            if subscription_plans:
                subscription_plans.update(status=self.status) 

    def save(self, *args, **kwargs):
        if self._state.adding:
            self._validate_creation_status()
        super().save(*args, **kwargs)
    

class Invoice(models.Model):
    STATUS = [
        ("DRAFT", "Draft"),
        ("PAID", "Paid"),
        ("OVERDUE", "Overdue"),
        ("VOID", "Void"),
        ("UNCOLLECTABLE", "Uncollectable"),
    ]

    client = models.ForeignKey(
        Client, default=None, blank=False, on_delete=models.CASCADE, related_name="Invoice")
    representative = models.ForeignKey(
        Representative, default=None, blank=False, on_delete=models.CASCADE, related_name="Invoice")
    subscription = models.ForeignKey(
        Subscription, blank=False, null=False, on_delete=models.PROTECT, related_name="Invoice")
    status = models.CharField(max_length=15, choices=STATUS, default="Draft")
    created = models.DateField(auto_now_add=True)
    due_date = models.DateField(editable=True, null=True, blank=True)
