from django.db import models,transaction,IntegrityError
from django.utils.translation import gettext_lazy as _
from User.models import User
from Notification.channel.enums import NotificationChannels,NotificationCategory,NotificationState
from abc import abstractmethod
from Notification.channel.manager import NotificationManager


class NotificationBase(models.Model):


    user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=False,
        blank=False,
        related_name='notification',
        verbose_name=_("user")
    )

    subject = models.CharField(
        max_length=255, 
        blank=False,
        null=False,

    )

    channel = models.CharField(
        max_length=15,
        choices=NotificationChannels,

    )
    
    status = models.CharField(
        max_length=15,
        choices=NotificationState,
        help_text="current state of notification."
    )

    category = models.CharField(
        max_length=30,
        choices=NotificationCategory,
    )

    

    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="The date and time the event was recorded."
    )

    details = models.JSONField(
        default=dict,
        help_text="Stores the nested event path and dynamic data."
    )

    error = models.TextField(
        blank=True, 
        null=True
    )


    objects = NotificationManager() 

    class Meta:
        abstract = True
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
    def _send(self):
        pass

    def send(self):
        self._send()