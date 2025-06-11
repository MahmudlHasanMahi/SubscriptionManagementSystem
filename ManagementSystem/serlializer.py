from .models import *
from rest_framework import serializers

class ProductSerializer(serializers.ModelSerializer):
    default_price = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Product
        fields = ["name","created_at","default_price"]
    
    def get_default_price(self,obj):
        if obj.default_price is not None:
            return f"{obj.default_price.price} / {obj.default_price.period}" 
        

class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = "__all__"
    
class PriceListSerializer(serializers.ModelSerializer):
    period = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PriceList
        fields = ["id","price","period"]
    
    def get_period(self,obj):
        return f"{obj.period}"