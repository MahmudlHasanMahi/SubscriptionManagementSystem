from .Enum import SubscriptionState,SubscriptionPlanState
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from .CustomManager import SubscriptionManager
from django.db import models,transaction
from User.models import User,Client
from django.utils import timezone
from viewflow.fsm import State
from datetime import timedelta
from .Time import Time
from .Enum import InvoiceStatus
from Notification.tasks import send_invoice_notification


class InvoiceMixIn(models.Model,Time):

    state_field  =   State(SubscriptionState, default=InvoiceStatus.DRAFT)

    class Meta:
        abstract = True


    @state_field.setter()
    def _set_report_state(self, value):
        self.status = value

    @state_field.getter()
    def _get_report_state(self):
        return self.status
    
    @state_field.transition(source=InvoiceStatus.DRAFT)
    def open(self,commit:bool = False):

        if self.is_status(InvoiceStatus.OPEN):
            return        

        if not self.is_finalized:
            raise ValidationError(_("Invoice is not finalized yet")) 

        fields = []
        fields.extend[self.set_status(InvoiceStatus.OPEN)]

        if commit:
            return self.save(update_fields=fields)
        return fields

    def set_status(self,status,commit:bool=False):
        self.status = status
        return ["status"]
    

    @state_field.transition(source=InvoiceStatus.DRAFT)
    def finalize(self,update_finalize_date:bool=False,commit:bool=False):

        fields = []
        if self.is_status(InvoiceStatus.OPEN) and self.is_finalized :
            return 
        
        status = self.set_status(InvoiceStatus.OPEN)
        fields.extend(status)
        if update_finalize_date:
            self.finalize_date = self.time_now
            fields.append("finalize_date")
            
        if commit:
            return self.save(update_fields=fields)

        return fields

    @state_field.transition(source=InvoiceStatus.OPEN)
    def paid(self,commit:bool=False):
        fields = []
        if (self.is_status(InvoiceStatus.PAID) or 
             self.is_status(InvoiceStatus.VOID) or
             self.is_status(InvoiceStatus.DRAFT)):
            return

        status = self.set_status(InvoiceStatus.PAID)
        fields.extend(status)
        self.paid_date = self.time_now
        fields.append("paid_date")
        self.add_to_aftersave_tasks(self.notify_paid)
        if commit:
            return self.save(update_fields=fields)
        return fields

    def is_status(self,status,raise_error:bool=False):
        return self.status == status
  

    @state_field.transition(source=InvoiceStatus.OPEN)
    def overdue(self, force_overdue:bool=False, commit:bool=False):
        fields = []
        
        if (
            self.is_status(InvoiceStatus.OVERDUE) or 
            not self.is_status(InvoiceStatus.OPEN)
            ):
            return

        if not self.passed_due_date and not force_overdue:
            raise ValidationError(_("Invoice is not yet overdue.")) 


        status = self.set_status(InvoiceStatus.OVERDUE)
        fields.extend(status)
   
        if commit:
            return self.save(update_fields=fields)
        
        return fields   


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
    
    def notify_paid(self):        
        send_invoice_notification.delay(self.pk,self.client.pk,"Paid","send_invoice")


    @property
    def is_finalized(self):
        return self.finalize_date < self.time_now

    @property
    def passed_due_date(self):
        return self.due_date and self.due_date < self.time_now
