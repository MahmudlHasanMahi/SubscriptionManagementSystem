from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm
from .models import User,Admin,Manager,Employee
from django.contrib.auth.models import Group
from django.contrib import admin
from django import forms
class CustomUserCreationForm(UserCreationForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('email',)
    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        
        return user




class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm

    list_display = ["id","name","email",'mobile', 'groups','is_active']
    list_filter = ['admin',]
    fieldsets = [
        [None, {'fields': ["email","mobile","name","is_active","admin","staff", "password"]}],
        ['Permissions', 
         
         {
             "classes": ["wide","collapse"],
             'fields': ['groups',]
        }],
        ]
    add_fieldsets = [
        [None, {
            
            'fields': ['email',"mobile",'password1', 'password2'],
        }],
    ]
    search_fields = ('mobile',)
    ordering = ('mobile',)
    filter_horizontal = ()
    def has_view_permission(self, request, obj = ...):
        
        return request.user.has_perm("can_view_user")

  
    



class AdminAdmin(UserAdmin):
    def save_model(self, request, obj, form, change):
        obj.groups = Group.objects.get(name="Admin")  
        super().save_model(request, obj, form, change)

class ManagerAdmin(UserAdmin):
    def save_model(self, request, obj, form, change):
        obj.groups = Group.objects.get(name="Manager")    
        super().save_model(request, obj, form, change)

class EmployeeAdmin(UserAdmin):
    def save_model(self, request, obj, form, change):
        obj.groups = Group.objects.get(name="Employee")    
        super().save_model(request, obj, form, change)


admin.site.register(User,UserAdmin)
admin.site.register(Manager,ManagerAdmin)
admin.site.register(Employee,EmployeeAdmin)
admin.site.register(Admin,AdminAdmin)





