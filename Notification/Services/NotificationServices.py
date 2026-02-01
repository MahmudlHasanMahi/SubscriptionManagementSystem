import os
import re
from jinja2 import Template
from django.utils.html import strip_tags

from django.template import Template, Context

class NotificationService:

    def __init__(self,user,channels) :
        self.user = user
        self.channels = channels
        self.notification_instance = []
        self.html = None
        self.plaintext = None

    def save_models(self):
        pass


    def generate(self,subject,context,text,html):

        # lines = [line.strip() for line in text.splitlines()]
        # text = '\n'.join([line for line in lines if line]) 


        for channel in self.channels:
            instance = channel( 
                                subject=subject,
                                user=self.user,
                                status="GENERATED",
                                channel=channel.Channel_Type,
                                details=context
                               )

            if instance.support_html:
                instance.set_html(html)

            
            instance.save()       
            
            self.notification_instance.append(instance)
        



    def send(self):
        for instance in self.notification_instance:
            instance.send()
          
        



            
        


