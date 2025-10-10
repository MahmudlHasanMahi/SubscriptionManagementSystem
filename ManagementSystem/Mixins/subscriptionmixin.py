from django.db import models,transaction
from User.models import User,Client
from datetime import datetime, timezone
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from viewflow.fsm import State
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

class SubscriptionPlanState(models.TextChoices):
    ACTIVE      = 'ACTIVE', _('Active')
    DEACTIVE    = 'DEACTIVE', _('Deactive')
    CANCELLED   = 'CANCELLED', _('Cancelled')
    EXPIRED     = 'EXPIRED', _('Expired')
    PAUSED      = 'PAUSED', _('PAUSED')


class SubscriptionState(models.TextChoices):
    DRAFT       =   'DRAFT', _('Draft')
    SCHEDULED   =   'SCHEDULED', _('Scheduled')
    PENDING     =   'PENDING', _('Pending')
    ACTIVE      =   'ACTIVE', _('Active')
    DEACTIVE    =   'DEACTIVE', _('Deactive')
    CANCELLED   =   'CANCELLED', _('Cancelled')
    EXPIRED     =   'EXPIRED', _('Expired')
    REJECTED    =   'REJECTED', _('Rejected')





class SubscriptionMixIn(models.Model):

    client       =   models.ForeignKey(Client, null=False,blank=False, on_delete=models.PROTECT, related_name="Subscription")
    status       =   models.CharField(max_length=15, choices=SUBSCRIPTION_STATUS, default="DRAFT")
    rejected_by  =   models.ForeignKey(User,blank=True,null=True,on_delete=models.PROTECT, related_name="subscriptions_rejected_by")
    created_by   =   models.ForeignKey(User,blank=False,null=False,on_delete=models.PROTECT, related_name="subscriptions_created_by")
    approved_by  =   models.ForeignKey(User,blank=True,null=True,on_delete=models.SET_NULL,related_name="subscriptions_approved_by")

    begin        =   models.DateTimeField(null=True, default=datetime.now, editable=True)
    end          =   models.DateTimeField(null=True, blank=True, editable=True)
    trial_end    =   models.DateTimeField(null=True,default=datetime.now(),blank=True)
    renewal_date =   models.DateTimeField(null=True,blank=True)

    state_field  =   State(SubscriptionState, default=SubscriptionState.DRAFT)



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

        now_utc = datetime.now(timezone.utc)
        return now_utc.date() == self.begin.date()


    @state_field.transition(source=SubscriptionState.DRAFT)
    def _validate_creation(self):
        created_by = self.created_by
        if created_by.has_perm("ManagementSystem.can_approve_subscription"):
            self.approve(created_by)
        else:
            self.set_status("PENDING")
    
    @state_field.transition(source=SubscriptionState.PENDING)
    @state_field.transition(source=SubscriptionState.DRAFT)
    def approve(self,approved_by,commit: bool = False):
        fields = []
        if self.approved_by:
            return
        if self.is_current_day():
            field = self.set_status("DEACTIVE")
            self.activate(commit)
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
    def activate(self,commit: bool = False):
        if self.rejected_by: 
            raise ValidationError(_(
                f"Cannot activate this subscription because it was rejected by {self.rejected_by}."
            ))
        self.renewal_date = datetime.now(timezone.utc)
        field = self.set_status("ACTIVE")
        # self.active_subscription_plans()
        if commit:
            self.save(update_fields=field)
        
    @state_field.transition(source=SubscriptionState.PENDING)
    def reject(self,rejected_by:User,commit: bool = False):
        fields = []
        if self.status == "REJECTED":
            return 
        fields.extend(self.set_status("REJECTED"))
        
        self.rejected_by = rejected_by
        fields.append("rejected_by")
        if commit:
            self.save(update_fields=fields)
    
    # could use to celery task to offload this function for performance 
    @state_field.transition(source=SubscriptionState.ACTIVE)
    def active_subscription_plans(self):
        
        if not self.can_edit_or_add_plans:
            raise ValidationError(_("Unable to active Subscription plans"))

        plans = self.subscription_plans.all()
        for plan in plans:
            plan.activate(commit=True)
    #--

    

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


            # print(self.subscription_plans.model.objects.)

    @property
    def in_trial(self):
        now_utc = datetime.now(timezone.utc)
        return now_utc.date() <= self.trial_end.date()

    @property
    def can_edit_or_add_plans(self):
        return self.status not in DISALLOWED_CREATION_STATUSES

    @property
    def is_active(self):
        return self.status == "ACTIVE"



class SubscriptionPlanMixIn(models.Model):

    product         =   models.ForeignKey("ManagementSystem.Product",default=None,related_name="subscription_plan_%(class)s_related",on_delete=models.PROTECT)
    status          =   models.CharField(max_length=15, choices=SubscriptionPlanState, default="DEACTIVE")
    subscription    =   models.ForeignKey("ManagementSystem.Subscription", null=False, blank=False, on_delete=models.PROTECT, related_name="subscription_plans")
    quantity        =   models.PositiveIntegerField(default=1)
    price           =   models.ForeignKey("ManagementSystem.PriceList",blank=False,null=False,on_delete=models.PROTECT,related_name="subscription_plan_%(class)s_related")
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

        if subscription.is_active:
            self.activate()
        else:
            self.set_status("DEACTIVE")
    
        
    @state_field.transition(source=SubscriptionPlanState.DEACTIVE)
    @state_field.transition(source=SubscriptionPlanState.PAUSED)
    def activate(self,commit: bool = False):
        if not self.subscription.is_active:
            raise ValidationError(_("This subscription is not active"))
        
        if not self.subscription.in_trial:
            return 
        
        self.set_status("ACTIVE")
        if commit:
            self.save(update_fields=["status"])

    def set_status(self,status):
        for STATUS in SUBSCRIPTIONPLAN_STATUS:
            if STATUS[0] == status:
                self.status = status
                return

        raise ValidationError(_(f"invalid status: {status}"))


    @state_field.transition(source=SubscriptionPlanState.PAUSED)
    @state_field.transition(source=SubscriptionPlanState.DEACTIVE)
    @state_field.transition(source=SubscriptionPlanState.ACTIVE)
    def cancel(self):
        self.set_status("CANCELLED")






    

    


