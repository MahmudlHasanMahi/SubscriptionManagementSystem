from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.generics import ListAPIView
from .serlializer import * 
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import APIView
from rest_framework.response import Response
from .models import *
def home(request):
    return 


class ProductsList(ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Product.objects.all()

class PeriodView(ListAPIView,APIView):
    serializer_class  = PeriodSerializer
    permission_classes = (IsAuthenticated,)
    model = Period

    def get_queryset(self):
        period_objects = self.model.objects.all()
        # serialized_data = self.serializer_class(period_objects,many=True)
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
