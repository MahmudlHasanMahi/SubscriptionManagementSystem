from math import ceil
from .models import *
from rest_framework import serializers
from User.serializers import UserSerializer
from datetime import datetime
from .sql import *
from User.mixins.TranslatedFieldsMixin import TranslatedFieldMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.utils.dateparse import parse_datetime

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ["email","id","name"]
    
    def create(self, validated_data):

        return super().create(validated_data)

    def update(self, instance, validated_data):

        return super().update(instance, validated_data)

class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = "__all__"
    
class CurrencySerializer(serializers.ModelSerializer):
  


    class Meta:
        model = Currency
        fields = ["native_name","code","id"]

  

    


class PriceListSerializer(serializers.ModelSerializer):
    formatted = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = PriceList
        fields = ["id","price","period","currency","formatted"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["period"]  = PeriodSerializer(instance.period).data
        representation["currency"] = CurrencySerializer(instance.currency).data

        return representation
    def get_formatted(self,instance):
        currency = instance.currency

        if currency.symbol_position == "before":

            return f"{currency.symbol}{instance.price} / {instance.period.name}"
        else:
            return f"{instance.price}{currency.symbol} / {instance.period.name}"


    
class ProductSerializer(TranslatedFieldMixin,serializers.ModelSerializer):
   
    class Meta:
        model = Product
        fields = ["id",'name', 'created_at','description', 'price_list', 'default_price']
    
    
    def to_representation(self, instance):
        
        representation = super().to_representation(instance)
        representation['price_list'] = PriceListSerializer(instance.price_list.all(), many=True).data
        price_data = PriceListSerializer(instance.default_price).data
        representation['default_price'] = PriceListSerializer(instance.default_price).data
        
        return representation
  
    

    
class BulkSubscriptionPlanSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        plans = [SubscriptionPlan(subscription=item.pop("subscription"),**item) for item in validated_data]
        return SubscriptionPlan.objects.bulk_create(plans)
        # return  {"detail":"success"}k
        
class _InternalSubscriptionPlanSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = SubscriptionPlan
        fields = ["id","status","price","quantity","product","subscription"]
        list_serializer_class = BulkSubscriptionPlanSerializer
    
    

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    # product = ProductSerializer()
    id = serializers.IntegerField(required=False)


    class Meta:
        model = SubscriptionPlan
        fields = ["id","price","quantity","product","status"]
    def to_representation(self, instance):
        representation =  super().to_representation(instance)
        representation["product"] = ProductSerializer(instance.product).data
        representation["price"] = PriceListSerializer(instance.price).data
        return representation
    def update(self, instance, validated_data):
        # print(instance,validated_data)
        return super().update(instance, validated_data)
    
    

def validate_same_period(subscription_plans):
    inital_period = subscription_plans[0].get("price").period
    for plans in subscription_plans:
        current_period = plans.get("price").period
        if inital_period != current_period:
            raise serializers.ValidationError({"error":"All products must have the same duration."})
    
class SubscriptionSerializer(TranslatedFieldMixin,serializers.ModelSerializer):
    subscription_plans =  SubscriptionPlanSerializer(many=True,required=False)
    creator = serializers.SerializerMethodField(read_only=True)
    client_detail = serializers.SerializerMethodField(read_only=True)
    cycle = serializers.CharField(required=False) 

    class Meta:
        model = Subscription
        fields = ["id","begin","end","status","creator","created_by","client_detail","client","subscription_plans","cycle"]
    
    def get_creator(self,instance):
        return UserSerializer(instance.created_by).data
    def get_client_detail(self,instance):
        return UserSerializer(instance.client).data
    
    # def validate_end(self, value):

    #     if not value:
    #         return None
    #     if value.lower() == "forever":
    #         return None

    #     dt = parse_datetime(value)
    #     if dt is None:
    #         raise serializers.ValidationError("Invalid datetime format for end field")

    #     # Make it timezone-aware if not already
    #     if timezone.is_naive(dt):
    #         dt = timezone.make_aware(dt, timezone=timezone.utc)
    #     return dt
    
    def date_subtract(self,a,b):
        return datetime.fromisoformat(b.replace("Z", "+00:00")) - datetime.fromisoformat(a.replace("Z", "+00:00")) 

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        begin = representation["begin"] 
        end = representation["end"] 
        period = instance.subscription_plans.first().price.period.days
        

        cycle =  _("Forever")
        endDate =  None
        if end is not None:
            endDate = datetime.fromisoformat(end.replace("Z", ""))
            cycle = ceil(self.date_subtract(begin,end).days / period)

        beginDate =  datetime.fromisoformat(begin.replace("Z", ""))


        representation["end"] = endDate;
        representation["cycle"] = cycle;
        representation["begin"] = beginDate;
        return representation 


    def create_subscription_plans(self,status,products,subscription):
        status = "ACTIVE" if status == "ACTIVE" else "DEACTIVE"
        plans_object = [{"product":product.get("product").id,"quantity":product.get("quantity"),"price":product.get("price").id,"status":status,"subscription":subscription.id} for product in products]
        serializer = _InternalSubscriptionPlanSerializer(data=plans_object,many=True) 
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return serializer
        


    def create(self,validated_data):
        subscription = Subscription.create_subscrption(**validated_data)
        return subscription

    def update(self, instance, validated_data):
        subscriptionPlans = validated_data.pop("subscription_plans",[])
        old_subscription_plan = []
        new_subscription_plan = []
        for plan in subscriptionPlans:
            id = plan.get("id",False)
            if id:

                subscription_plan = SubscriptionPlan(subscription = instance,**plan)
                old_subscription_plan.append(subscription_plan)
            else:
                subscription_plan = SubscriptionPlan.create_subscriptionPlan(subscription = instance,**plan)
                new_subscription_plan.append(subscription_plan)

        SubscriptionPlan.objects.bulk_update(old_subscription_plan, fields=['price', 'quantity', 'product', 'status'])      
        SubscriptionPlan.objects.bulk_create(new_subscription_plan)


        return super().update(instance, validated_data)


class InvoiceDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = InvoiceDetail
        fields = ["product","quantity","price"]
    
    def to_representation(self, instance):
        representation =  super().to_representation(instance)
        representation["product"] = ProductSerializer(instance.product).data
        representation["price"] = PriceListSerializer(instance.price).data
        return representation




class InvoiceSerializer(serializers.ModelSerializer,TranslatedFieldMixin):
    invoice_detail =  InvoiceDetailSerializer(many=True,required=False)
    # client = ClientSerializer()
    notify = serializers.BooleanField(required=False)
    class Meta:
        model = Invoice 
        fields = ["client","due_date","finalize_date","status","created","id","invoice_detail","notify"]

    def to_representation(self, instance):
        obj = super().to_representation(instance) 
        # print(instance.client)
        obj["client"] = ClientSerializer(instance.client).data
        return obj

    def create(self, validated_data):
        invoice = Invoice.create_invoice(**validated_data)

        # invoice_details_serializer = InvoiceDetailSerializer(data=invoice_details,many=True)
        # if invoice_details_serializer.is_valid(raise_exception=True):
        #     invoice_details_serializer.save()

        return invoice

    def update(self, instance, validated_data):
        invoice_details = validated_data.pop("invoice_detail",[])
        arr = []
        for invoice_detail in invoice_details:
            arr.append(InvoiceDetail(**invoice_detail,invoice=instance))
        
        InvoiceDetail.objects.bulk_create(arr)
        



        
        return super().update(instance, validated_data)
        
