from django.contrib.auth.models import BaseUserManager  
from .CustomGroup import Groups

class UserManager(BaseUserManager):

    def create_user(self,email,mobile,password,*args,**kwargs):
        if not email:
            raise ValueError("User must have an email address")

        user = self.model(email = self.normalize_email(email),mobile=mobile,**kwargs)
        user.staff = True
        user.is_active = kwargs.get("is_active",False)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self,email,mobile,password):
        user = self.create_user(email=email,mobile=mobile,password=password,is_superuser=True,is_active=True)
        user.save(using=self._db)
        return user


    def create_admin(self,email,mobile,password,name,is_active=False):
        if not email:
            raise ValueError("User must have an email address")
    
        user = self.model(email = self.normalize_email(email),mobile = mobile,name = name)
        user.admin = True
        user.is_active = is_active
        user.set_password(password)

        user.save(using=self._db)

        return user

    def create_manager(self,email,mobile,password,name,is_active=False):
        user = self.create_admin(email,mobile,password,name,is_active=is_active)
        self.assignGroup(user,"Manager")
        user.save()
        return user

    def create_employee(self,*args, **kwargs):
        user = self.create_user(*args,**kwargs)
        user.save()
        self.assignGroup(user,"Employee")
        return user

    def change_group(self,group):
        self.group = Groups.objects.get(name=group) 

    def promote_user(to=None):
        pass

    @classmethod
    def assignGroup(self,user,group_name):
        try:
            group = Groups.objects.get(name=group_name)
        except Groups.DoesNotExist:
            pass
        else:
            user.groups.add(group)
            return user


class _StaffManager(UserManager):
    def get_queryset(self,group_name,*args,**kwargs):
        try:
            query = super().get_queryset(*args, **kwargs)
            group = Groups.objects.get(name=group_name)
        except Groups.DoesNotExist:
            return query.none()
        else:
            return query.filter(groups=group)

class ManagerManager(_StaffManager):
    
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset("Manager", *args, **kwargs)

class AdminManager(_StaffManager):
    def get_queryset(self,*args,**kwargs):
        return super().get_queryset("Admin",*args,**kwargs)
        

class EmployeeManager(_StaffManager):
    def get_queryset(self,*args,**kwargs):
        return super().get_queryset("Employee",*args,**kwargs)