import os 
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SubscriptionManagement.settings')

app = Celery("SubscriptionManagement")

app.config_from_object("django.conf:settings",namespace="CELERY")



app.autodiscover_tasks()