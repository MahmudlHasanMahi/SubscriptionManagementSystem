from typing import Any
from django.db import models
from django.db.models import Q,F
from .Time import Time
class SubscriptionManager(models.Manager,Time):
    SUBSCRIPTIONPLAN_PERMANENT_STATUS = ["EXPIRED","CANCELLED"] 
    def get_queryset(self) :
        return super().get_queryset().exclude(status__in=self.SUBSCRIPTIONPLAN_PERMANENT_STATUS)

    def scheduled_subscription(self):
        return self.filter(status="SCHEDULED",begin__lte=self.time_now)

    def due_for_renewal(self):
        return self.filter(status="ACTIVE").filter(
            Q(renewal_date__lte=self.time_now))

    def expired(self):
        return self.filter(end__lte=models.F("renewal_date"))

    def expired_subscription(self):
        return self.filter(status="EXPIRED")




class InvoiceManager(models.Manager,Time):
    def get_queryset(self):
        return super().get_queryset()

    def post_finalize(self):
        return self.filter(status="DRAFT",finalize_date__lt=self.time_now)

    def post_due_date(self):
        return self.filter(status="OPEN",due_date__lt=self.time_now)

    def paid(self):
        return self.filter(status="PAID")

    