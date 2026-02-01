from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class test(APIView):
    permission_classes = [AllowAny]
    def get(self):

        return Response({"detail":"data"})