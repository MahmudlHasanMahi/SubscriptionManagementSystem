from .models import *
from rest_framework import serializers
from User.serializers import UserSerializer
from datetime import datetime
from .sql import *
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = "__all__"
    
    def create(self, validated_data):

        return super().create(validated_data)

    def update(self, instance, validated_data):

        return super().update(instance, validated_data)

class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = "__all__"


class PriceListSerializer(serializers.ModelSerializer):
    period = PeriodSerializer()

    class Meta:
        model = PriceList
        fields = ["id","price","period"]
    
class ProductSerializer(serializers.ModelSerializer):
   
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
    
class SubscriptionSerializer(serializers.ModelSerializer):
    subscription_plans =  SubscriptionPlanSerializer(many=True,required=False)
    creator = serializers.SerializerMethodField(read_only=True)
    client_detail = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Subscription
        fields = ["id","begin","end","status","creator","created_by","client_detail","client","subscription_plans"]
    
    def get_creator(self,instance):
        return UserSerializer(instance.created_by).data
    def get_client_detail(self,instance):
        return UserSerializer(instance.client).data
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        begin = representation["begin"] 
        date =  datetime.fromisoformat(begin.replace("Z", "")).date()
        representation["begin"] = date;
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
        if validated_data.get("status") == "CANCELLED":
            instance.cancel(commit=True)
            return instance
        old_subscription_plan = []
        new_subscription_plan = []
        for plan in validated_data.pop("subscription_plans"):
            id = plan.get("id",False)
            if id:

                subscription_plan = SubscriptionPlan(subscription = instance,**plan)
                old_subscription_plan.append(subscription_plan)
            else:
                subscription_plan = SubscriptionPlan.create_subscriptionPlan(subscription = instance,**plan)
                new_subscription_plan.append(subscription_plan)
                
        SubscriptionPlan.objects.bulk_update(old_subscription_plan, fields=['price', 'quantity', 'product', 'status'])      
        SubscriptionPlan.objects.bulk_create(new_subscription_plan)


        return instance
        # return super().update(instance, validated_data)




        
