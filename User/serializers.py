from rest_framework import serializers
from django.contrib.auth.models import Group
from .models import User

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id","name"]

class UserSerializer(serializers.ModelSerializer):
    group = serializers.SerializerMethodField()
    group_pk = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["id","email","name","mobile","last_login","group","group_pk","is_active"]
    
    def get_group(self,obj):
        group = obj.groups
        if(group):
            return group.name
        return None
    def get_group_pk(self,obj):
        group = obj.groups
        if(group):
            return group.pk
        return None 
        
    # def create(self,validated_data):
    #     user = User.objects.create()
    #     return

