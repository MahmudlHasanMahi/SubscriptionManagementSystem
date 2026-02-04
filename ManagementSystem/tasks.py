from django.db import models,transaction,IntegrityError
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from .serlializer import SubscriptionSerializer
from .models import Subscription,Invoice,InvoiceDetail
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
    


@shared_task
def generate_invoice(*args, **kwargs):
        invoice_details = kwargs.pop("invoice_detail",[])
        subscription = kwargs.pop("subscription",False)
        notify = kwargs.pop("notify",False)
        if subscription:
            subscription = Subscription.objects.get(pk=subscription)

            invoice_details = [ {"product":plans.product,"quantity":plans.quantity,"price":plans.price} for plans in (subscription.subscription_plans
                    .filter(status="ACTIVE")
                    .prefetch_related("product")
                    )]
            
        if not (invoice_details or subscription):
            raise ValidationError(_("At least one invoice details must be provided."))

        try:
            with transaction.atomic():   
                print(invoice_details)
                invoice = Invoice(**kwargs)
                invoice.save()

                invoice_details_object = []
                for invoice_detail in invoice_details:
                    obj = InvoiceDetail(**invoice_detail,invoice=invoice)
                    invoice_details_object.append(obj)           
                InvoiceDetail.objects.bulk_create(invoice_details_object)

            if notify:
                invoice.add_to_aftersave_tasks(invoice.notify_paid)
                invoice._run_after_save_queue()

            

        except IntegrityError:
            raise ValidationError(_("Failed to create invoice due to invalid or duplicate data."))

        return invoice

