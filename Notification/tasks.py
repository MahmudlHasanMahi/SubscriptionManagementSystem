from celery import shared_task
from .Services.NotificationServices import NotificationService
from User.models import User

from .models import EmailNotification

from .SubscriptionNotification import SubscriptionNotification
from .InvoiceNotification import InvoiceNotification 


@shared_task()
def send_subscription_notification(subscription_id,recipient_id,subject ,attribute,channels=None):
 
    channels = [EmailNotification]
    user = User.objects.get(pk=recipient_id)
    subscription_notification = SubscriptionNotification(subscription_id,subject)

    # error checking

    body = getattr(subscription_notification, attribute)

    context,text,html = body()

    notification = NotificationService(user,channels)

    notification.generate(subject,context,text,html)
    
    notification.send()

@shared_task()
def send_invoice_notification(invoice_id,recipient_id,subject,attribute,channels=None):
    channels = [EmailNotification]
    user = User.objects.get(pk=recipient_id)
    invoice_notification = InvoiceNotification(invoice_id,subject)

    body = getattr(invoice_notification, attribute)

    context,text,html = body()

    notification = NotificationService(user,channels)

    notification.generate(subject,context,text,html)
    
    notification.send()

    pass


@shared_task()
def send_user_notification(user_id,channels,subject,attr):
    
    pass
