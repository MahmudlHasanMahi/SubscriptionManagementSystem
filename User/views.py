from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie,csrf_protect
from rest_framework.response import Response 
from rest_framework.decorators import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import status
from .models import User,Admin,Manager,Employee
from django.contrib.auth import login,authenticate
from .serializers import UserSerializer,GroupSerializer
from django.contrib.auth import logout
from itertools import chain
from .Pagination import StaffPagination
from rest_framework.generics import ListAPIView 
from django.contrib.auth.models import Group
from django.db.models import Q

import time
class ResetPassword(APIView):
    permission_classes = (AllowAny,)

    @method_decorator(csrf_protect)
    def post(self,request):
        data = request.data
        id = data.get("id")
        old_password = data.get("old_password")
        password = data.get("password")
        re_password = data.get("re_password")
        try:
            user = User.objects.get(pk=id)
        except:
            return Response({"msg":"something went wrong"})
        else:
            if(user.check_password(old_password) and password == re_password ):
                
                user.set_password(password)
                user.save()
                login(request,user)
                return Response({"success":"password changed"})
            return Response({"failed":"password don't match"},status = status.HTTP_401_UNAUTHORIZED)

        



    
class CheckAuthentication(APIView):
    permission_classes = (AllowAny,)
    def get(self,request):
        user = request.user
        try:
            if user.is_authenticated:
                serializer = UserSerializer(user)
                

                return Response(serializer.data,status=status.HTTP_200_OK)
            return Response(status = status.HTTP_401_UNAUTHORIZED)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class SignUp(APIView):
    permission_classes = (AllowAny,)

    @method_decorator(csrf_protect)
    def post(self,request):
        data = request.data
        email = data.get("email")
        password = data.get("password")
        try:
            user = authenticate(email=email,password=password)
            if user is not None:
                if(user.last_login):
                    login(request,user)
                serialized = UserSerializer(user)
                return Response(serialized.data)
            return Response({"err":"Invalid password or email"},status = status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({"err":"Something went wrong"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Signout(APIView):
    permission_classes=(IsAuthenticated,)
    
    @method_decorator(csrf_protect)
    def post(self,request):
        logout(request)
        return Response({"success":"logout successfull"})
    


class GetCSRFToken(APIView):
    permission_classes = (AllowAny,)

    @method_decorator(ensure_csrf_cookie)
    def get(self,request,format=None):
        return Response({"message":"cookie is sent"});

class StaffList(ListAPIView):
    serializer_class = UserSerializer
    pagination_class = StaffPagination
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        request = self.request
 
        if hasattr(request.user,"Admin"):
            Admin = Group.objects.get(name="Admin")
            obj = User.objects.exclude(groups=Admin)
    
            return obj
        elif hasattr(request.user,"Manager"):
            employee = Employee.objects.all()
            return employee
        elif hasattr(request.user,"Employee"):
            return Employee.objects.none()
        else:
            return Employee.objects.none()

    def paginate_queryset(self, *args, **kwargs):
        request = self.request
        page_size = request.GET.get("page_size")
        self.pagination_class.set_page_size(page_size)
      
        return super().paginate_queryset(*args,**kwargs)

    def list(self, request, *args, **kwargs):
        count = request.GET.get("count")
        obj = self.get_queryset()
        if count:
            return Response({"count":obj.count()})
        return super().list(request, *args, **kwargs)

class GroupsView(APIView):
    permission_classes=(IsAuthenticated,)
    def get(self,request):
        if hasattr(request.user,"Admin"):
            group = Group.objects.exclude(name="Admin")
            serializer = GroupSerializer(group,many=True)
            return Response(serializer.data)

        elif hasattr(request.user,"Manager"):

            group = Group.objects.filter(name="Employee")
            serializer = GroupSerializer(group,many=True)
            return Response(serializer.data)
            
        elif hasattr(request.user,"Employee"):
            return Response({})
        else:
            return Response({})      
class StaffView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    def get(self,request,id):
        try:
            user = User.objects.get(pk=id)
            serializer = self.serializer_class(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"err":"User does not exists"},status=status.HTTP_404_NOT_FOUND)


    def post(self,request,id):
        print(id)
        time.sleep(5)
        return Response({})





class CreateStaffView(APIView):
    permission_classes=(IsAuthenticated,)

    def post(self,request):
        data = request.data
        email = data.get("email")
        mobile = data.get("mobile")
        if User.objects.filter(Q(email=email)|Q(mobile=mobile)).exists():
            return Response({"error":"User with same email or mobile number exists"},status=status.HTTP_409_CONFLICT)
        
        group_name = Group.objects.get(pk=data.get("group"))
        password = data.get("password")
        name = data.get("name")
        is_active = data.get("active")
        if group_name.name == "Admin":
            Admin.objects.create_admin(email=email,mobile=mobile,password=password,name=name,is_active=is_active)
            return Response(status=status.HTTP_200_OK)

        elif group_name.name == "Manager":
            Manager.objects.create_manager(email=email,mobile=mobile,password=password,name=name,is_active=is_active)
            return Response(status=status.HTTP_200_OK)
        elif group_name.name == "Employee":
            manager = request.user.Manager
            Employee.objects.create_employee(manager=manager,email=email,mobile=mobile,password=password,name=name,is_active=is_active)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({"error":"Invalid User Group"},status=status.HTTP_400_BAD_REQUEST)

class test(APIView):
    permission_classes=(AllowAny,)
    def get(self,request):
        serializer = UserSerializer(User.objects.get(email="Manager2@manager.com"))
        return Response(serializer.data)