from django.db import models

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from .managers import *

from django.utils.translation import gettext_lazy as _

from cities_light.models import Country,City,Region,SubRegion

class Profile(models.Model):
    user = models.OneToOneField(
        "User", null=True, on_delete=models.CASCADE, related_name="profile_%(class)s_related",verbose_name=_("Profile"))

    class Meta:
        abstract = True

    def __str__(self):
        return f'{self.user}'


class AdminProfile(Profile):
    pass


class ManagerProfile(Profile):
    pass


class EmployeeProfile(Profile):
    pass


class ClientProfile(Profile):
    address = models.CharField(max_length=1024, blank=False,verbose_name=_("Address"))


class User(AbstractBaseUser, PermissionsMixin):

    email           =   models.EmailField(max_length=300, unique=True, blank=True,verbose_name=_("Email"))
    name            =   models.CharField(max_length=64, blank=False, null=False,verbose_name=_("Name"))
    mobile          =   models.IntegerField(blank=True, null=True, unique=True,verbose_name=_("Mobile"))
    joined          =   models.DateField(auto_now_add=True,verbose_name=_("Joined"))
    groups          =   models.ManyToManyField(Groups,verbose_name=_("Groups"))

    objects         =   UserManager()

    is_active       =   models.BooleanField(verbose_name=_("Active"), default=False)
    admin           =   models.BooleanField(default=False,verbose_name=_("Admin"))
    staff           =   models.BooleanField(default=False,verbose_name=_("Staff"))

    manager         =   models.ForeignKey('User', null=True, blank=True, on_delete=models.SET_NULL)

    USERNAME_FIELD  =   'email'
    REQUIRED_FIELDS =   ['mobile']

       

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        if self.name:
            self.name = self.name.capitalize()

        super().save(*args, **kwargs)
        type = getattr(self, "_type", None)

        if not is_new:
            return

        if type == "Manager":
            self.groups.add(Groups.objects.get(name=type))
            ManagerProfile.objects.create(user=self)

        elif type == "Employee":
            self.groups.add(Groups.objects.get(name=type))
            EmployeeProfile.objects.create(user=self)
        elif type == "Client":
            self.groups.add(Groups.objects.get(name=type))
            ClientProfile.objects.create(user=self)
        else:
            return
    
    

    @property
    def is_staff(self):
        return self.staff

    @property
    def is_admin(self):
        return self.admin


class Address(models.Model):
    user = models.ForeignKey(User,on_delete=models.PROTECT,null=False,blank=False)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True) 
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    subregion = models.ForeignKey(SubRegion, on_delete=models.SET_NULL, null=True, blank=True)

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


class Client(User):
    objects = ClientManager()
    class Meta:
        proxy = True

