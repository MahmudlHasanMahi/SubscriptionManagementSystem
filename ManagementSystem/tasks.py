from .serlializer import SubscriptionSerializer
from .models import Subscription,Invoice
from django.core.mail import send_mail as mail
from celery import shared_task
from .Mixins.Time import Time

@shared_task
def scheduled_task():
    arr = []

    subs = Subscription.objects.scheduled_subscription()  

    for sub in subs:
        before = SubscriptionSerializer(sub).data 
        
        sub.activate(commit=True,renew=True,activate_plans=True)
        after = SubscriptionSerializer(sub).data 
        log = {
            "before": before,
            "after":after
        }
        arr.append(log) 

    subs = Subscription.objects.due_for_renewal() 
    for sub in subs:
        sub.renew_subscription(commit=True,generate_invoice=True)
    
    subs = Subscription.objects.expired()

    for sub in subs:
        sub.expire(commit=True)
    

    invoice_post_finalize = Invoice.objects.post_finalize()

    for invoice in invoice_post_finalize:
        invoice.finalize(commit=True)


    return arr
    

