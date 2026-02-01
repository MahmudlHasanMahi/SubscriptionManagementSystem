from django.db import models
from django.utils.translation import gettext_lazy as _

class NotificationChannels(models.TextChoices):
    WHATSAPP    = 'WHATSAPP', _('WhatsApp')
    SMS         = 'SMS', _('SMS')
    EMAIL       = 'EMAIL', _('Email')

class NotificationCategory(models.TextChoices):
    Subscription  = 'SUBSCRPTION', _('Subscription')
    Invoice       = 'INVOICE', _('Invoice')
    User          = 'USER', _('User')
    

class NotificationState(models.TextChoices):
    GENERATED    =   'GENERATED', _('Generated')
    QUEUED       =   'QUEUED', _('Queued')
    DELIVERED    =   'DELIVERED', _('Delivered')
    FAILED       =   'FAILED', _('Failed')
    