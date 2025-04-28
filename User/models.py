from django.db import models

from django.contrib.auth.models import Group,AbstractBaseUser,PermissionsMixin
from .managers import UserManager,AdminManager,ManagerManager,EmployeeManager
        

class User(AbstractBaseUser,PermissionsMixin):

    email       =   models.EmailField(max_length=300,unique=True,blank=True)
    name        =   models.CharField(max_length=64,blank=False,null=False)
    mobile      =   models.IntegerField(blank=True,null=True,unique=True)
    joined      =   models.DateField(auto_now_add=True)
    groups      =   models.ForeignKey(Group,blank=True,null=True,on_delete=models.PROTECT)

    
    objects     =   UserManager()


    is_active   =   models.BooleanField(verbose_name="Active",default=False)
    admin       =   models.BooleanField(default=False)
    staff       =   models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['mobile']

    class Meta:
        pass
        permissions = []
        
    def save(self,*args, **kwargs):
        # print(self.model)
        if self.name:
            self.name = self.name.capitalize()
        super().save(*args, **kwargs)
        

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always

        return super().has_perm(perm,obj)
        # return True


    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        return self.staff

    @property
    def is_admin(self):
        return self.admin




class Admin(User):
    objects = AdminManager()
    class Meta:
        proxy = True




    
class Manager(User):
    objects = ManagerManager()
    class Meta:
        proxy = True

    
class Employee(User):
    objects = EmployeeManager()
    class Meta:
        proxy = True