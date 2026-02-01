from .models import Product as ProductModel, Subscription as SubscriptionModel, Client as ClientModel, Period, PriceList, Invoice as InvoiceModel
from rest_framework.permissions import IsAuthenticated,AllowAny
from .serlializer import _InternalSubscriptionPlanSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.exceptions import ValidationError
from .Exception import NotFound,CannotCreateProduct 
from django.http import JsonResponse,HttpResponse
from .permissions  import SubscriptionPermission
from rest_framework.generics import ListAPIView
from .generate_invoice import generate_invoice
from rest_framework.decorators import APIView
from rest_framework.response import Response
from django.shortcuts import render
from .pagination import Pagination
from rest_framework import status
from django.db.models import Q
from .serlializer import * 
from .sql import *
from .tasks import scheduled_task
from djmoney.models.fields import MoneyField
import os
import time

def home(request):
    return 


class ProductBase:
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticated,)
    model = ProductModel

class SubscriptionBase:
    serializer_class = SubscriptionSerializer
    permission_classes = (IsAuthenticated,)
    model = SubscriptionModel 

class ClientBase:
    serializer_class = ClientSerializer
    permission_classes = (IsAuthenticated,)
    model = ClientModel



class InvoiceBase:
    serializer_class = InvoiceSerializer
    permission_classes = (IsAuthenticated,)
    model = InvoiceModel

class CurrencyBase:
    PermissionDenied = (IsAuthenticated,)
    model = Currency

class ProductsList(ProductBase, ListAPIView):
    # pagination_class = Pagination
    def get_queryset(self):
        filter = self.request.GET.get("filterby")
        data = self.request.GET.get("data")
        query = get_products_sql(filter=filter,data=data)
        return query
        
    # def paginate_queryset(self, *args, **kwargs):
    #     request = self.request
    #     page_size = request.GET.get("page_size")
    #     self.pagination_class.set_page_size(page_size)
    #     return super().paginate_queryset(*args,**kwargs)

class ProductView(ProductBase, APIView):
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail":"Product successfully created!"})
        
        raise ValidationError(serializer.errors)
    def get(self,request,id):
        try:
            # obj = self.model.objects.get(id=id)
            obj = get_product_sql(id)
              
        except self.model.DoesNotExist:
            raise NotFound(detail="Product not found")
        
        serializers = self.serializer_class(obj).data
        return Response(serializers)

    def patch(self,request,id):
        try:
            product = get_product_sql(id=id)
           
        except self.model.DoesNotExist:
            raise NotFound(detail="Product not found")

        serializer = self.serializer_class(product,data=request.data,partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"detail":"Product successfully updated!"})
        else:
            raise ValidationError(serializer.errors)
            
class PeriodView(ProductBase, ListAPIView):
    serializer_class  = PeriodSerializer
    permission_classes = (IsAuthenticated,)
    model = Period

    def get_queryset(self):
        period_objects = self.model.objects.all()
        return period_objects
    def get(self,request):
        serialized_data = self.serializer_class(self.get_queryset(),many=True)
        return Response(serialized_data.data)
    def post(self,request):
        
        return Response({"detail":"successfull"},status=status.HTTP_200_OK)

class CurrencyView(CurrencyBase,ListAPIView):
    serializer_class = CurrencySerializer
    permission_classes = (IsAuthenticated,)
    model = Currency

    def get_queryset(self):
        obj = self.model.objects.all()
        return obj




class PriceListView(ListAPIView,APIView):
    serializer_class = PriceListSerializer
    # pagination_class = Pagination
    permission_classes = (IsAuthenticated,)
    model = PriceList

    def get_queryset(self):
        filter = self.request.GET.get("filter")
        
        queryset = get_price_list(filter=filter)
        # if filter:
        #     parts = re.split(r"[/\s]", filter)
        #     if parts.__len__() == 2:
        #         price, period = parts
        #         queryset = queryset.filter(Q(price__icontains=price) | Q(period__name__icontains=period))
        #         return queryset
        #     else:
        #         queryset = queryset.filter(Q(price__icontains=filter) | Q(period__name__icontains=filter))
        #         return queryset

        return queryset

    def paginate_queryset(self, *args, **kwargs):
        request = self.request
        page_size = request.GET.get("page_size")
        self.pagination_class.set_page_size(page_size)
        return super().paginate_queryset(*args,**kwargs)

    def get(self,request):
        serializers_data = self.serializer_class(self.get_queryset(),many=True)
        return Response(serializers_data.data)
    def post(self,request):
        serialized = self.serializer_class(data=request.data)
        print(serialized)
        if serialized.is_valid(raise_exception=True):
            serialized.save()
            return Response({"detail":"successfull"},status=status.HTTP_200_OK)
        

        # period = request.data.get("period",None)
        # price = request.data.get("price",None)
        # pricelist = create_pricelist(price,period)



class SubscriptionListView(SubscriptionBase, ListAPIView):
    pagination_class = Pagination
    def get_queryset(self):
        filterby = self.request.GET.get("filterby")
        data = self.request.GET.get("data")
        if filterby == "approved" and data == "false":
            return self.model.objects.filter(approved=False)
        return self.model.objects.all()

    def paginate_queryset(self, *args, **kwargs):
        request = self.request
        page_size = request.GET.get("page_size")
        self.pagination_class.set_page_size(page_size)
        return super().paginate_queryset(*args,**kwargs)

class SubscriptionView(SubscriptionBase, APIView):

    def post(self,request):
        if request.user.has_perm("ManagementSystem.add_subscription"):
            serialized = self.serializer_class(data=request.data,context={'user': request.user})
            if serialized.is_valid(raise_exception=True):
                serialized.save()
                
                return Response({"detail":"Subscription successfully created!"})
                
            raise ValidationError(serialized.errors)
        else:
            raise PermissionDenied()

    def get(self,request,id):
        try:
            subscription = self.model.objects.get(id=id)
        except self.model.DoesNotExist:
            raise NotFound(detail="Subscription not found")
        serializer = self.serializer_class(subscription)
        return Response(serializer.data)


    def patch(self,request,id,action=None):
        if action is None:
            try:
                obj = self.model.objects.get(pk=id)
            except self.model.DoesNotExist:
                return Response({"detail":"This subscription does not exists"},status=status.HTTP_404_NOT_FOUND)

            else:
                serializer = self.serializer_class(obj,data=request.data,partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()

                    return Response({"detail":"Subscription successfully updated!"})

                return Response(serializer.errors)
        elif action == "cancel":

            try:
                obj = self.model.objects.get(pk=id)
            except self.model.DoesNotExist:
                return Response({"detail":"This subscription does not exists"},status=status.HTTP_404_NOT_FOUND)
            else:
                obj.cancel(commit=True)
                return Response({"detail":f"Subscription {id} is cancelled"})
        else:

            return Response({"detail":"invalid url"},status=status.HTTP_400_BAD_REQUEST)


class SubscriptionApproval(SubscriptionBase,APIView):
    permission_classes = [IsAuthenticated|SubscriptionPermission]
    def get(self,request):
        obj = Subscription.objects.filter(approved_by=None,rejected_by=None).exclude(status="CANCELLED")

        serialized = self.serializer_class(obj,many=True)
        return Response(serialized.data)
    
    def patch(self,request,pk,action):
        if action not in ["approve", "reject"]:
            return Response({"error": "Invalid url"}, status=400)

        user = request.user
        try:
            
            subscription = Subscription.objects.get(pk = pk)
        except Subscription.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

        if action == "approve":
            subscription.approve(approved_by=user,commit=True)
            # subscription.active_subscription_plans()

            return Response({"detail":"Subscription approved!"})

               

        subscription.reject(request.user,commit=True) 
        return Response({"detail":"Subscription rejected"})
        

class Invoice(InvoiceBase,APIView):
    def get(self,request,pk):
        obj = self.model.objects.get(pk=pk)
        serializer = self.serializer_class(obj)
        return Response(serializer.data)

    def patch(self,request,pk,action=None):
        try:

            obj = self.model.objects.get(pk=pk)
        except self.model.DoesNotExist:
            return Response({"detail":"This invoice does not exists"},status=status.HTTP_404_NOT_FOUND)
        else:

            actions  = ["pay","finalize"]
            if action not in actions:
                return Response({"detail":"Invalid Request"},status=status.HTTP_400_BAD_REQUEST)

            if action == "pay":
                print(obj)
                obj.paid(commit=True)
                return Response({"detail":"Invoice is mark as paid"})
            elif action == "finalize":
                obj.finalize(commit=True,update_finalize_date=True)
                return Response({"detail":"Invoice is finalized"})
            else:
                serializer = self.serializer_class(obj,data=request.data,partial=True)
                
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return Response({"detail":"Invoice updated"})
                return Response(serializer.errors)
                

    def post(self,request):
        data = request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"detail":"Invoice created"})
        return Response(serializer.errors)


class InvoiceListView(InvoiceBase, ListAPIView):
    pagination_class = Pagination
    def get_queryset(self):

        filterby = self.request.GET.get("filterby")
        data = self.request.GET.get("data")
        if filterby:
            return self.model.objects.filter(**{filterby: data})
        return self.model.objects.all()
    

    def paginate_queryset(self, *args, **kwargs):
        request = self.request
        page_size = request.GET.get("page_size")
        self.pagination_class.set_page_size(page_size)
        return super().paginate_queryset(*args,**kwargs)
    # def paginate_queryset(self, *args, **kwargs):
    #     request = self.request
    #     page_size = request.GET.get("page_size")
    #     self.pagination_class.set_page_size(page_size)
        # return super().paginate_queryset(*args,**kwargs)




class ClientView(ClientBase, ProductsList):
    pagination_class = Pagination
    def get_queryset(self):
        return Client.objects.all()





class test(APIView,InvoiceBase):
    def get(self,request):
        scheduled_task()
        return Response({"test":""})
    
    def get_queryset(self):
        return self.model.objects.all()
