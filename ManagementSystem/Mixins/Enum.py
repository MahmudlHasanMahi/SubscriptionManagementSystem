from django.db import models
from django.utils.translation import gettext_lazy as _

class SubscriptionState(models.TextChoices):
    DRAFT       =   'DRAFT', _('Draft')
    SCHEDULED   =   'SCHEDULED', _('Scheduled')
    PENDING     =   'PENDING', _('Pending')
    ACTIVE      =   'ACTIVE', _('Active')
    DEACTIVE    =   'DEACTIVE', _('Deactive')
    CANCELLED   =   'CANCELLED', _('Cancelled')
    EXPIRED     =   'EXPIRED', _('Expired')
    REJECTED    =   'REJECTED', _('Rejected')

class SubscriptionPlanState(models.TextChoices):
    ACTIVE      = 'ACTIVE', _('Active')
    DEACTIVE    = 'DEACTIVE', _('Deactive')
    CANCELLED   = 'CANCELLED', _('Cancelled')
    EXPIRED     = 'EXPIRED', _('Expired')
    PAUSED      = 'PAUSED', _('PAUSED')

class InvoiceStatus(models.TextChoices):
    DRAFT           =   'DRAFT', _('Draft')
    OPEN            =   'OPEN',_('Open')
    PAID            =   'PAID', _('Paid')
    VOID            =   'VOID', _('Void')
    UNCOLLECTABLE   =   'UNCOLLECTABLE', _('Uncollectable')
    OVERDUE         =   'OVERDUE', _('Overdue')
