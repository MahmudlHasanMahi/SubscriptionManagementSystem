from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.generics import ListAPIView
from .serlializer import * 
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .Exception import NotFound,CannotCreateProduct 
from rest_framework.exceptions import ValidationError
from .models import *
import time

def home(request):
    return 

class Product:
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticated,)
    model = Product

class Subscription:
    serializer_class = SubscriptionSerializer
    permission_classes = (IsAuthenticated,)
    model = Subscription 


class ProductsList(Product,ListAPIView):
    def get_queryset(self):
        return self.model.objects.all()

class ProductView(Product,APIView):
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail":"Product successfully created!"})
        
        raise ValidationError(serializer.errors)
    def get(self,request,id):
        try:
            obj = self.model.objects.get(id=id)
           
        except self.model.DoesNotExist:
            raise NotFound(detail="Product not found")
        
        serializers = self.serializer_class(obj).data
        return Response(serializers)

    def patch(self,request,id):
        try:
            product = self.model.objects.get(id=id)
           
        except self.model.DoesNotExist:
            raise NotFound(detail="Product not found")

        serializer = self.serializer_class(product,data=request.data,partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"detail":"Product successfully updated!"})
        else:
            raise ValidationError(serializer.errors)
    
class PeriodView(Product,ListAPIView):
    serializer_class  = PeriodSerializer
    permission_classes = (IsAuthenticated,)
    model = Period

    def get_queryset(self):
        period_objects = self.model.objects.all()
        return period_objects

    def get(self,request):
        serialized_data = self.serializer_class(self.get_queryset(),many=True)
        return Response(serialized_data.data)



class PriceListView(ListAPIView,APIView):
    serializer_class = PriceListSerializer
    permission_classes = (IsAuthenticated,)
    model = PriceList

    def get_queryset(self):
        return self.model.objects.all()

    def get(self,request):
        serializers_data = self.serializer_class(self.get_queryset(),many=True)
        return Response(serializers_data.data)



class SubscriptionListView(Subscription,ListAPIView):
    def get_queryset(self):
        return self.model.objects.all()

class SubscriptionView(Subscription,APIView):
    def post(self,request):
        serialized = self.serializer_class(data=request.data,context={'user': request.user})

        if serialized.is_valid(raise_exception=True):
            serialized.save()
            return Response(serialized.data)
            return Response({"details":"Subscription successfully created!"})
        raise ValidationError(serialized.errors)

    def get(self,request,id):
        try:
            subscription = self.model.objects.get(id=id)
        except self.model.DoesNotExist:
            raise NotFound(detail="Subscription not found")
        serializer = self.serializer_class(subscription)
        return Response(serializer.data)

    def patch(self,request,id):
        pass
    # def delete(self,request,id):
    #     pass




class test(Subscription,APIView):
    def get(self,request,id):
        obj = self.model.objects.get(id=id)
        obj.activate_subscription()
        return Response({})
