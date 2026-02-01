from .Enum import SubscriptionState,SubscriptionPlanState
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from Notification.tasks import send_subscription_notification
from .CustomManager import SubscriptionManager
from django.db import models,transaction
from User.models import User,Client
from django.utils import timezone
from viewflow.fsm import State
from datetime import timedelta
from .Time import Time
import time
import os
SUBSCRIPTION_STATUS = [
    ("DRAFT","Draft"),
    ("SCHEDULED","Scheduled"),
    ("PENDING","Pending"),
    ("ACTIVE", "Active"),
    ("DEACTIVE", "Deactive"),
    ("CANCELLED", "Cancelled"),
    ("EXPIRED", "Expired"),
    ("REJECTED","Rejected")
]

SUBSCRIPTIONPLAN_STATUS = [
        ("ACTIVE", "Active"),
        ("CANCELLED", "Cancelled"),
        ("DEACTIVE", "Deactive"),
        ("EXPIRED", "Expired"),
    ]

DISALLOWED_CREATION_STATUSES = ["EXPIRED","CANCELLED","REJECTED"]

SUBSCRIPTIONPLAN_PERMANENT_STATUS = ["EXPIRED","CANCELLED"] 

class SubscriptionMixIn(models.Model,Time):

    client       =   models.ForeignKey(Client, null=False,blank=False, on_delete=models.PROTECT, related_name="Subscription", verbose_name=_("Client"))
    status       =   models.CharField(max_length=15, choices=SUBSCRIPTION_STATUS, default="DRAFT", verbose_name=_("Status"))
    rejected_by  =   models.ForeignKey(User,blank=True,null=True,on_delete=models.PROTECT, related_name="subscriptions_rejected_by", verbose_name=_("Rejected_by"))
    created_by   =   models.ForeignKey(User,blank=False,null=False,on_delete=models.PROTECT, related_name="subscriptions_created_by", verbose_name=_("Created_by"))
    approved_by  =   models.ForeignKey(User,blank=True,null=True,on_delete=models.SET_NULL,related_name="subscriptions_approved_by", verbose_name=_("Approved_by"))
    begin        =   models.DateTimeField(null=True, default=timezone.now, editable=True, verbose_name=_("Begin"))
    end          =   models.DateTimeField(null=True, blank=True, editable=True, verbose_name=_("End"))
    trial        =   models.PositiveIntegerField(null=False,blank=False,default=0, verbose_name=_("Trial"))
    renewal_date =   models.DateTimeField(null=True,blank=True, verbose_name=_("Renewal date"))
    rejected_at  =   models.DateTimeField(null=True,blank=True,default=None,verbose_name=_("Rejected at"))


    state_field  =   State(SubscriptionState, default=SubscriptionState.DRAFT)

    objects = SubscriptionManager()

    class Meta:
        abstract = True

   
    @state_field.setter()
    def _set_report_state(self, value):
        self.status = value

    @state_field.getter()
    def _get_report_state(self):
        return self.status


    def is_current_day(self):
        if not self.begin:
            raise AttributeError(_("Cannot create subscription: begin date is missing."))
        return self.time_now  >= self.begin
    
    def add_to_aftersave_tasks(self,func,*args, **kwargs):

        if not callable(func):
            raise ValueError("Callback must be callable")

        self._after_save_queue.append((func,args,kwargs))
        
    def _run_after_save_queue(self):

        for func, args, kwargs in self._after_save_queue:

            def runner(f=func, a=args, k=kwargs):
                if hasattr(f, "delay"):
                    return f.delay(**k) 
                return f(**k)

            transaction.on_commit(runner)

        self._after_save_queue.clear()


    def notify_activate_subscription(self):        
        send_subscription_notification.delay(self.pk,self.client.pk,"New Subscription","new_subscription")



    def notify_expired_subscription(self):
        send_subscription_notification.delay(self.pk,self.client.pk,"Expired Subscription","expired_subscription")


    @state_field.transition(source=SubscriptionState.DRAFT)
    def _validate_creation(self):
            self.set_status("PENDING")
    
    @state_field.transition(source=SubscriptionState.PENDING)
    @state_field.transition(source=SubscriptionState.DRAFT)
    def approve(self,approved_by,commit: bool = False):
        fields = []
        if self.approved_by:
            return

        self.set_renewal_date()
        fields.append("renewal_date")

        if self.is_current_day():
            field = self.set_status("DEACTIVE")
            self.activate(commit,renew=True,activate_plans=True)
        else:
            field = self.set_status("SCHEDULED")

        fields.extend(field)

        self.approved_by = approved_by
        fields.append("approved_by")

        if commit:
            self.save(update_fields=fields)
        else:
            return fields
    
    @state_field.transition(source=SubscriptionState.SCHEDULED)
    @state_field.transition(source=SubscriptionState.DEACTIVE)
    def activate(self,commit: bool = False, renew: bool = False,activate_plans:bool = False):
        if self.rejected_by: 
            raise ValidationError(_(
                f"Cannot activate this subscription because it was rejected by {self.rejected_by}."
            ))

        fields = self.set_status("ACTIVE")
        if activate_plans:
            self.active_subscription_plans(commit)    
        # Invoice could be generated from here and asynchrously

        if renew:
            self.renew_subscription(commit,generate_invoice=True)
      
        self.add_to_aftersave_tasks(self.notify_activate_subscription)

        if commit:
            self.save(update_fields=fields)

        return fields
        
    def set_renewal_date(self):
        self.renewal_date = self.begin + timedelta(days=self.trial)
        return self.renewal_date



    @state_field.transition(source=SubscriptionState.ACTIVE)
    @state_field.transition(source=SubscriptionState.DEACTIVE)
    def expire(self,commit: bool=False):
        fields = self.set_status("EXPIRED")

        self.expire_subscription_plans(commit=commit)
        self.add_to_aftersave_tasks(self.notify_expired_subscription)
        if commit:
            self.save(update_fields=fields)

        



        
    @state_field.transition(source=SubscriptionState.EXPIRED)
    def expire_subscription_plans(self,commit: bool = False):

        plans = self.subscription_plans.filter(status="ACTIVE")
        for plan in plans:
            plan.expire(commit=commit)


    def extend_renewal_date(self,commit: bool = False):
        if self.in_trial:
            return False
        if self.has_reached_expiry_date:
            self.expire(commit=commit)
            return False
        

        period = self.subscription_plans.first().price.period.days
        if self.begin + timedelta(days=self.trial) == self.renewal_date: 
            self.renewal_date += timedelta(days=period-self.trial) 
        else:
            self.renewal_date += timedelta(days=period) 

        if commit:
            self.save(update_fields=["renewal_date"])
        return True


        
    @state_field.transition(source=SubscriptionState.PENDING)
    def reject(self,rejected_by:User,commit: bool = False):
        fields = []
        if self.status == "REJECTED":
            return 
        fields.extend(self.set_status("REJECTED"))

        self.rejected_by = rejected_by
        self.rejected_at = self.time_now

        fields.append("rejected_by")
        fields.append("rejected_at")


        if commit:
            return self.save(update_fields=fields)
            
        return fields
    
    # could use to celery task to offload this function for performance 
    @state_field.transition(source=SubscriptionState.ACTIVE)
    def active_subscription_plans(self,commit: bool = False):
        
        if not self.can_edit_or_add_plans:
            raise ValidationError(_("Unable to active Subscription plans"))

        plans = self.subscription_plans.filter(status="DEACTIVE")
        for plan in plans:
            plan.activate(commit=commit)
            
    #--

    @state_field.transition(source=SubscriptionState.ACTIVE)
    def renew_subscription(self,commit:bool = False,generate_invoice=False):
        is_successfull = self.extend_renewal_date(commit=commit)
        if is_successfull:
            self.active_subscription_plans(commit=commit)
            if generate_invoice:
                self.generate_invoice()


    def set_status(self,status):
        for STATUS in SUBSCRIPTION_STATUS:
            if STATUS[0] == status:
                self.status = status
                return ["status"]
        raise ValidationError(_(f"invalid status: {status}"))

    @state_field.transition(source=SubscriptionState.ACTIVE)
    @state_field.transition(source=SubscriptionState.SCHEDULED)
    @state_field.transition(source=SubscriptionState.DEACTIVE)
    def cancel(self,commit: bool = False):
        plans = self.subscription_plans.all()
        temp = []
        for plan in plans:
            try:
                plan.cancel()
                temp.append(plan)
            except:
                pass

        with transaction.atomic():
            self.subscription_plans.model.objects.bulk_update(temp, ['status'])
            fields = self.set_status("CANCELLED")
            if commit:
                self.save(update_fields=fields)






    @property
    def in_trial(self):
        trial_end_date = self.begin + timedelta(days=self.trial)
        return  self.time_now  < trial_end_date

    @property
    def can_edit_or_add_plans(self):
        return self.status not in DISALLOWED_CREATION_STATUSES

    @property
    def is_active(self):
        return self.status == "ACTIVE"

    @property
    def is_renewal_date_passed(self):
        return self.time_now  >= self.renewal_date

    @property   
    def has_reached_expiry_date(self):
        return self.end and self.time_now >= self.end



class SubscriptionPlanMixIn(models.Model,Time):

    product         =   models.ForeignKey("ManagementSystem.Product",default=None,related_name="subscription_plan_%(class)s_related",on_delete=models.PROTECT, verbose_name=_("Product"))
    status          =   models.CharField(max_length=15, choices=SubscriptionPlanState, default="DEACTIVE", verbose_name=_("Status"))
    subscription    =   models.ForeignKey("ManagementSystem.Subscription", null=False, blank=False, on_delete=models.PROTECT, related_name="subscription_plans", verbose_name=_("Status"))
    quantity        =   models.PositiveIntegerField(default=1, verbose_name=_("Quantity"))
    price           =   models.ForeignKey("ManagementSystem.PriceList",blank=False,null=False,on_delete=models.PROTECT,related_name="subscription_plan_%(class)s_related", verbose_name=_("Price"))
    state_field     =   State(SubscriptionPlanState, default=SubscriptionPlanState.DEACTIVE)



    class Meta:
        abstract = True

   
    @state_field.setter()
    def _set_report_state(self, value):
        self.status = value

    @state_field.getter()
    def _get_report_state(self):
        return self.status


    def _validate_creation(self):
        subscription = self.subscription
        if not subscription.can_edit_or_add_plans:
            raise ValidationError(_(f"Cannot add plans: subscription is {subscription.status}."))

        if subscription.is_active and subscription.is_renewal_date_passed:
            self.activate()
        else:
            self.set_status("DEACTIVE")
    
        
    @state_field.transition(source=SubscriptionPlanState.DEACTIVE)
    @state_field.transition(source=SubscriptionPlanState.PAUSED)
    def activate(self,commit: bool = False):
        if not self.subscription.is_active:
            raise ValidationError(_("This subscription is not active"))
        
        self.set_status("ACTIVE")
        if commit:
            self.save(update_fields=["status"])

    def set_status(self,status):
        for STATUS in SUBSCRIPTIONPLAN_STATUS:
            if STATUS[0] == status:
                self.status = status
                return

        raise ValidationError(_(f"invalid status: {status}"))

    def expire(self ,commit: bool=False):
        self.set_status("EXPIRED")
        if commit:
            self.save(update_fields=["status"])

    @state_field.transition(source=SubscriptionPlanState.PAUSED)
    @state_field.transition(source=SubscriptionPlanState.DEACTIVE)
    @state_field.transition(source=SubscriptionPlanState.ACTIVE)
    def cancel(self):
        self.set_status("CANCELLED")






    

    


