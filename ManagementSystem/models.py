from django.db import models
from datetime import datetime,timedelta




class Client(models.Model):
    client              =   models.CharField(max_length=64,blank=False)
    address             =   models.CharField(max_length=1024,blank=False) 
    representative      =   models.ManyToManyField("Representative",blank=True,related_name="Client")
    class Meta:
        verbose_name_plural = "Clients"
    
    def __str__(self):
        return self.client
  
class Representative(models.Model):
    
    name                =   models.CharField(max_length=64,unique=True,blank=False)
    client              =   models.ManyToManyField(Client, blank=True,related_name="Representative")

    def __str__(self):
        return self.name
    

class SubscriptionType(models.Model):

    type                =   models.CharField(max_length=64,blank=False,unique=True)
    period              =   models.IntegerField(blank=False,default=60)
    
    # class Meta:
    #     verbose_name = "Subscription"

    def __period__(self):
        return f"{self.period} - days"
    def __str__(self):
        return f"{self.type}"

class ServicesCategory(models.Model):
    name = models.CharField(max_length=64,unique=True,blank=False)

    class Meta:
        verbose_name_plural = "Services Categories"

    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=64,unique=True,blank=False)
    services = models.ForeignKey(ServicesCategory,blank=False,default=None,on_delete=models.PROTECT)

    def __str__(self):
        return f'{self.services} | {self.name}'


class Feature(models.Model):
    name = models.TextField(max_length=200)
    servicesCategory = models.ForeignKey(ServicesCategory,null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f'{self.servicesCategory} | {self.name}'

class SubscriptionPlan(models.Model):
    name                =   models.CharField(max_length=64,blank=False)
    price               =   models.IntegerField(blank=False)
    from_date           =   models.DateTimeField(auto_now_add=True,editable=False)
    to_date             =   models.DateTimeField(default=datetime(9999,12,20),blank=False)
    current             =   models.BooleanField(blank=False,default=True)
    service             =   models.ForeignKey(Service,default=None,on_delete=models.CASCADE)
    subscriptionType    =   models.ForeignKey(SubscriptionType,null=True,on_delete=models.SET_NULL,related_name="SubscriptionPlan")
    feature             =   models.ManyToManyField(Feature)
    expiry              =   models.DateTimeField(default=datetime.today())

    def __str__(self):
        return f"{self.service} | {self.name} | {self.subscriptionType.period} Days"

    

class Subscription(models.Model):
    
    subscriptionPlan    =   models.ForeignKey(SubscriptionPlan,default=None,on_delete=models.CASCADE,related_name="Subscription")
    client              =   models.ForeignKey(Client,null=True,on_delete=models.SET_NULL,related_name="Subscription")
    created             =   models.DateTimeField(auto_now_add=True,editable=False)
    expired             =   models.BooleanField(default=False) 
    
    def __str__(self):
        print(self.subscriptionPlan)
        return f'{self.subscriptionPlan}'

 

class Recipt(models.Model):
    STATUS = [
        ("None","None"),
        ("DRAFT","Draft"),
        ("UNPAID","Unpaid"),
        ("PAID","Paid"),
        ("ACTIVE","Active"),
        ("PENDING","Pending"),
        ("CANCELLED","Cancelled"),
    ]

    client              =   models.ForeignKey(Client,default=None,blank=False,on_delete=models.CASCADE,related_name="Recipt")
    representative      =   models.ForeignKey(Representative,default=None,blank=False,on_delete=models.CASCADE,related_name="Recipt")
    subscriptionPlan    =   models.TextField(blank=True, max_length=500, null=True)
    status              =   models.CharField(max_length=15,choices=STATUS,default="NONE")
    
    def save(self,*args,**kwargs):
        super().save(*args,**kwargs)