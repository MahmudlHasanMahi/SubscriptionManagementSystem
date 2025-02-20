from django.db import models
from django.contrib.auth.models import Group
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self,email,mobile,password=None):
        if not email:
            raise ValueError("User must have an email address")
        user = self.model(email = self.normalize_email(email),mobile=mobile)
        user.staff = True
        user.is_active = True
        user.set_password(password)
        user.save(using=self._db)
        return user
        
    def create_superuser(self,email,mobile,password):
        user = self.create_user(email,mobile,password)
        user.is_superuser = True
        user.save(using=self._db)
        return user
    
    def create_manager(self,email,mobile,password,name,is_active=False):
        if not email and mobile:
            raise ValueError("User must have an email address and mobile")
        user = self.model(email = self.normalize_email(email),mobile=mobile,name=name)
        user.is_active = is_active
        user.staff  = True
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_employee(self,email,mobile,password,name,manager,is_active=False):
        user = self.model(email = self.normalize_email(email),mobile=mobile,name=name,manager=manager)
        user.is_active = is_active
        user.staff  = True
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_admin(self,email,mobile,password,name,is_active=False):
        if not email:
            raise ValueError("User must have an email address")
    
        user = self.model(email = self.normalize_email(email),mobile = mobile,name = name)
        user.admin = True
        user.is_active = is_active
        user.save(using=self._db)
        return user
        

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
    user = models.OneToOneField(User,parent_link=True,on_delete=models.CASCADE,related_name="Admin")

    def save(self,*args, **kwargs):
        manager = Group.objects.get(name="Admin")
        self.groups = manager
        super().save(*args,**kwargs)

class Manager(User):
    user = models.OneToOneField(User,parent_link=True,on_delete=models.CASCADE,related_name="Manager")

    def save(self,*args, **kwargs):
        manager = Group.objects.get(name="Manager")
        self.groups = manager
        super().save(*args,**kwargs)
        

class Employee(User):
    user = models.OneToOneField(User,parent_link=True,on_delete=models.CASCADE,related_name="Employee")
    manager = models.ForeignKey(Manager,blank=False,on_delete=models.PROTECT)

    def save(self,*args, **kwargs):
        manager = Group.objects.get(name="Employee")
        self.groups = manager
        super().save(*args,**kwargs)

  
        