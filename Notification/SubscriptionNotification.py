import time

from jinja2 import Template
from django.utils.html import strip_tags
from django.template import Template, Context
import os
import re
class SubscriptionNotification:
    def __init__(self,id,subject):
        from ManagementSystem.models import Subscription
        self.subscription = Subscription.objects.get(id=id)
        self.subject = subject

    def get_html_context(self):
        total = 0
        plans = []

        for i in self.subscription.subscription_plans.all():
            price = i.price.price * i.quantity
            plans.append({
                    "product_name":i.product.name,
                    "quantity":i.quantity,
                    "unit_price":i.price.price,
                    "price":price,
                })
            total += price

        return  {
            "title":self.subject,
            "subscription": {
                "id":self.subscription.pk,
                "begin":self.subscription.begin.date().strftime("%Y-%m-%d")
            },
            "plans":plans,
            "total":total
        }
        
    def new_subscription(self):
        template_path = os.path.dirname(os.path.abspath(__file__)) + "/html_templates/activate_subscription.html"   
        context = self.get_html_context()

        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")

        with open(template_path, "r", encoding="utf-8") as f:
            template = Template(f.read())
        
        html = template.render(Context(context))
        html_clean = re.sub(r'<(script|style).*?>.*?</\1>', '', html, flags=re.S|re.I)

        text =  strip_tags(html_clean)



        return context,text,html
    
    
    def expired_subscription(self):
        template_path = os.path.dirname(os.path.abspath(__file__)) + "/html_templates/expired_subscription.html"   
        context = self.get_html_context()

        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template not found: {template_path}")

        with open(template_path, "r", encoding="utf-8") as f:
            template = Template(f.read())
        
        html = template.render(Context(context))
        html_clean = re.sub(r'<(script|style).*?>.*?</\1>', '', html, flags=re.S|re.I)

        text =  strip_tags(html_clean)



        return context,text,html

