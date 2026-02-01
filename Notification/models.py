from .channel.base.notify_base import NotificationBase
from .channel.mixins.notify_mixin import EmailNotificationMixin
from .channel.enums import NotificationChannels,NotificationState
from django.core.mail import get_connection

# class Notification(NotificationBase):
#     pass


class EmailNotification(NotificationBase,
                        EmailNotificationMixin):
    Channel_Type = NotificationChannels.EMAIL


    def _send(self):
        
        if not self.email_list:
            raise ValueError("Email list cannot be empty")

    
        try:
            connection = get_connection()
            
            connection.open()
            
            with connection:  
                connection.send_messages(self.email_list)
            
            self.status = NotificationState.DELIVERED
            self.save(update_fields=["status"])
            

        except Exception as exc:
            self.status = NotificationState.FAILED
            self.error = str(exc)[:250]   
            self.save(update_fields=["status", "error"])
            
            

    
    def send(self):
        self.email()
        super().send()


