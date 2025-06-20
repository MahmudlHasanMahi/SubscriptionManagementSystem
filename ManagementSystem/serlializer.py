from .models import *
from rest_framework import serializers



class PriceListSerializer(serializers.ModelSerializer):
    period = serializers.SerializerMethodField(read_only=True)
    title = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PriceList
        fields = ["id","price","period","title"]
    
    def get_period(self,obj):
        return f"{obj.period.name}"
    def get_title(self,obj):
        return f"{obj.price}/{obj.period.name}"
class ProductSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Product
        fields = ["id",'name', 'created_at','description', 'price_list', 'default_price']

    def to_representation(self, instance):
        
        representation = super().to_representation(instance)
        representation['price_list'] = PriceListSerializer(instance.price_list.all(), many=True).data
        price_data = PriceListSerializer(instance.default_price).data
        # representation['default_price'] = f'{price_data.get("price")}/{price_data.get("period")}' 
        representation['default_price'] = PriceListSerializer(instance.default_price).data

        return representation

    
class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = "__all__"
    
class BulkSubscriptionPlanSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        plans = [SubscriptionPlan(subscription=item.pop("subscription"),**item) for item in validated_data]
        return SubscriptionPlan.objects.bulk_create(plans)
class _InternalSubscriptionPlanSerializer(serializers.ModelSerializer):
    # product = ProductSerializer()
    class Meta:
        model = SubscriptionPlan
        fields = ["id","status","product","subscription"]
        list_serializer_class = BulkSubscriptionPlanSerializer

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    # product = ProductSerializer()
    class Meta:
        model = SubscriptionPlan
        fields = ["id","status","product"]

class SubscriptionSerializer(serializers.ModelSerializer):
    subscription_plans =  SubscriptionPlanSerializer(many=True)
    class Meta:
        model = Subscription
        fields = ["id","begin","end","status","client","subscription_plans"]
    
    def create(self,validated_data):
      
        subscription_plans = validated_data.get("subscription_plans")
        status = validated_data.get("status")
        days_inital = subscription_plans[0].get("product").default_price.period

        for plans in subscription_plans:
            days = plans.get("product").default_price.period
            if days_inital != days:
                raise serializers.ValidationError({"detail":"All products must have the same duration."})

        products = validated_data.pop("subscription_plans")
        subscription = Subscription.objects.create(**validated_data)

        plans_object = [{"product":product.get("product").id,"status":"DEACTIVE","subscription":subscription.id} for product in products]
        serializer = _InternalSubscriptionPlanSerializer(data=plans_object,many=True) 
        
        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return subscription




        


        
