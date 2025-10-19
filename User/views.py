from .serializers import UserSerializer,GroupSerializer,ChangePasswordSerializer,CreateUserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie,csrf_protect
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.utils.decorators import method_decorator
from django.contrib.auth import login,authenticate
from ManagementSystem.models import *
from rest_framework.generics import ListAPIView 
from .models import User,Employee
from rest_framework.decorators import APIView
from .CustomGroup import Groups
from rest_framework.response import Response 
from .Pagination import StaffPagination
from django.contrib.auth import logout
from rest_framework import status
import time

def staffQuery(user):
    user_level = user.groups.first().level
    return User.objects.filter(groups__level__gte=user_level)

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
                print(serialized.data)
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
        filterby = request.GET.get("filterby")
        if filterby:
            data = request.GET.get("data")
            if filterby == "groups":
                filterby = {f"{filterby}__name__icontains":data}
            else:
                filterby = {f"{filterby}__icontains":data}

            return staffQuery(request.user).filter(**filterby)
        return staffQuery(request.user)

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
        level = request.user.groups.first().level
        queryset = Groups.objects.filter(level__gte=level)
        serializer = GroupSerializer(queryset,many=True)
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


    def post(self,request):
        data = request.data
        serializer = CreateUserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        time.sleep(1)
        return Response({"error":"User with same email or mobile number exists"},status=status.HTTP_409_CONFLICT)

    def patch(self,request,id):
        serializer = self.serializer_class(User.objects.get(id=id),data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_409_CONFLICT)




class test(APIView):
    permission_classes=(AllowAny,)
    def get(self,request):
        # client = Client.objects.first().Subscription.prefetch_related("active_plans").explain()
        group = Groups.objects.filter(name="Manager")
        print(group)
        return Response()
