from .serializers import UserSerializer,GroupSerializer,ChangePasswordSerializer,CreateUserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie,csrf_protect
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.utils.decorators import method_decorator
from django.contrib.auth import login,authenticate
from ManagementSystem.models import *
from rest_framework.generics import ListAPIView 
from .models import User,Admin,Manager,Employee
from rest_framework.decorators import APIView
from django.contrib.auth.models import Group
from rest_framework.response import Response 
from .Pagination import StaffPagination
from django.contrib.auth import logout
from rest_framework import status
import time




def groupPerm_Queries(user):
    group = user.groups;

    if getattr(group,"name",None) == "Admin":
        return Group.objects.exclude(name="Admin")
    
    elif getattr(group,"name",None) == "Manager":
        return Group.objects.filter(name="Employee")

    return User.objects.none()

    
def staffPerm_Queries(user,count=False):
    group = user.groups;


    if getattr(group,"name",None) == "Admin":
        return User.objects.filter(groups=group)
    
    elif getattr(group,"name",None) == "Manager":
        return Employee.objects.all()

    elif getattr(group,"name",None) =="Employee":
        return User.objects.none()
        
    return User.objects.none()




class ResetPassword(APIView):
    permission_classes = (AllowAny,)

    @method_decorator(csrf_protect)
    def post(self,request):

        data = request.data
        userId = data.get("id")
        
        credential = {
            "old_password":data.get("old_password"),
            "password":data.get("password"),
            "re_password":data.get("re_password"),
        }
        try:
            user = User.objects.get(pk=userId)
            
        except:
            return Response({"msg":"something went wrong"})

        else:
            serializer = ChangePasswordSerializer(instance=user,data=credential,partial=True,context={"user":user})
        
            if serializer.is_valid():
                serializer.save()

                login(request,user)
                return Response(serializer.data)

            return Response(serializer.errors)


    
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

            if user:
                if(user.last_login):

                    login(request,user)

                serialized = UserSerializer(user)
                return Response(serialized.data)

            return Response({"error":"Invalid password or email"},status = status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({"error":"Something went wrong"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        return staffPerm_Queries(request.user)

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
        query = groupPerm_Queries(request.user)
        serializer = GroupSerializer(query,many=True)
        return Response(serializer.data)

class StaffView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    def get(self,request,id):
        try:
            user = User.objects.get(pk=id)
            serializer = self.serializer_class(user)
            time.sleep(0.5)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({"err":"User does not exists"},status=status.HTTP_404_NOT_FOUND)


    def post(self,request,id):
        user = User.objects.get(pk=id)
        serializer = CreateUserSerializer(instance=user,data=request.data,partial=True)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response({},status=status.HTTP_200_OK)

        return Response({"err":"User credientail error"},status=status.HTTP_409_CONFLICT)
            
        

class CreateStaffView(APIView):
    permission_classes=(IsAuthenticated,)

    def post(self,request):
        data = request.data
        email = data.get("email")
        mobile = data.get("mobile")
        
        serializer = CreateUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response({"error":"User with same email or mobile number exists"},status=status.HTTP_409_CONFLICT)


class test(APIView):
    permission_classes=(AllowAny,)
    def get(self,request):
        # client = Client.objects.first().Subscription.prefetch_related("active_plans").explain()
        group = Group.objects.filter(name="Manager")
        print(group)
        return Response()
