# from django.contrib.auth.models import Group
from .CustomGroup import Groups
from rest_framework import serializers
from .models import User, Employee,Manager,Admin
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groups
        fields = ["id","name"]





class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SerializerMethodField(read_only=True)
    groups_pk = serializers.SerializerMethodField(read_only=True)
    staff = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields =  ["id","email","name","mobile","last_login","groups","groups_pk","is_active","staff"]
       
      
    def get_staff(self,obj):
        return Employee.objects.count()


    def get_groups(self,obj):
        group = obj.groups.first()

        if group:
            return group.name
        return None

    def get_groups_pk(self,obj):
        group = obj.groups.first()
        if group:
            return group.pk
        return None 
    



class CreateUserSerializer(serializers.ModelSerializer): 
    group = serializers.CharField()
    active = serializers.BooleanField()

    class Meta:
        model = User
        fields =  ["email","name","mobile","group","password","is_active","active"]

       

    def create(self,validated_data):
        group_id = validated_data.get("group")
        name = validated_data.get("name")
        email = validated_data.get("email")
        password = validated_data.get("password")
        mobile = validated_data.get("mobile")
        is_active = validated_data.get("active")

        group = Groups.objects.get(pk=group_id)
        if getattr(group,"name",None) == "Admin":
            return User.objects.create_admin(email,mobile,password,name,is_active)
        elif getattr(group,"name",None) == "Manager":
            return User.objects.create_manager(email,mobile,password,name,is_active)
        elif getattr(group,"name",None) =="Employee":
            return User.objects.create_employee(email=email,mobile=mobile,password=password,name=name,is_active=is_active)



class ChangePasswordSerializer(UserSerializer):

    old_password = serializers.CharField(write_only=True,required=True,validators=[validate_password])
    password = serializers.CharField(write_only=True,required=True,validators=[validate_password])
    re_password = serializers.CharField(write_only=True,required=True)

    class Meta(UserSerializer.Meta):

        fields = UserSerializer.Meta.fields + ["old_password","password","re_password"]

    def validate(self, attrs):

        old_password = attrs.get("old_password")
        password = attrs.get('password')
        re_password = attrs.get('re_password') 
        user = getattr(self, "context", None).get("user")
        if user.check_password(old_password) and password != re_password:
            return serializers.ValidationError({"error":"password fields does not match"})

        return {"password":password}

    def update(self, instance, validated_data):
        instance.set_password(validated_data["password"])
        instance.save()
        return instance

    