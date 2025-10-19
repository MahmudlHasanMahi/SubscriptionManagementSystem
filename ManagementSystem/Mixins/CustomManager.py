from django.db import models
from django.db.models import Q,F
from .Time import Time
class SubscriptionManager(models.Manager,Time):
    def get_queryset(self) :
        return super().get_queryset()
    def scheduled_subscription(self):
        return self.filter(status="SCHEDULED",begin__lte=self.time_now)
    def due_for_renewal(self):
        return self.filter(status="ACTIVE").filter(
            Q(renewal_date__lte=self.time_now))
    # def about_to_expire(self):
        # return self.filter(renewal_date__gte=)
        # return
    def expired_subscription(self):
        return self.filter(status="EXPIRED")