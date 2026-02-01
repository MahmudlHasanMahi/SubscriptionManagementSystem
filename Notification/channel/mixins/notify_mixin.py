from django.core.mail import EmailMultiAlternatives,get_connection
from django.utils.html import strip_tags

class NotificationMixin:

    pass


class EmailNotificationMixin:
    def email(self):
        plaintxt = strip_tags(self._html)
        
        mail = EmailMultiAlternatives(
            subject=self.subject,
            body=plaintxt,
            to=[self.user.email]
        )

        mail.attach_alternative(self._html, "text/html")

        if hasattr(self,"email_list"):
            self.email_list.append(mail) 
        else:
            self.email_list = [mail]
    
    def set_html(self,html):
        self._html = html
    
    @property
    def support_html(self):
        return True


class SMSNotificationMixin:
    def send(self,):
        pass
