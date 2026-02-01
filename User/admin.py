from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm
from .models import *
from django.contrib.auth.models import Group
from django.contrib import admin
from django import forms
from django.contrib.sessions.models import Session

from parler.admin import TranslatableAdmin
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
    
class AdminProfileInline(admin.StackedInline):
    model = AdminProfile
class ManagerProfileInline(admin.StackedInline):
    model = ManagerProfile
class EmployeeProfileInline(admin.StackedInline):
    model = EmployeeProfile

class ClientProfileInline(admin.StackedInline):
    model = ClientProfile
class UserAdmin(BaseUserAdmin):

    add_form = CustomUserCreationForm

    list_display = ["id","name","email",'mobile', 'is_active']
    list_filter = ['admin',]
    fieldsets = (
        (None, {'fields': ("email", "mobile", "name", "is_active", "admin", "staff", "password","manager","last_login")}),
        ('Permissions',
            {
                "classes": ("wide", "collapse"),
                'fields': ('groups',)
            }
        ),
    )
    
    add_fieldsets = (
        (None, {
            'fields': ('email', "mobile", 'password1', 'password2')
        }),
    )
    search_fields = ('mobile',)
    ordering = ('mobile',)
    filter_horizontal = ()
    def has_view_permission(self, request, obj = ...):
        return request.user.has_perm("can_view_user")

class AdminAdmin(UserAdmin):
    inlines = [AdminProfileInline]
    def save_model(self, request, obj, form, change):
        obj._type = "Admin"
        super().save_model(request, obj, form, change)

class ManagerAdmin(UserAdmin):
    inlines = [ManagerProfileInline]
    def save_model(self, request, obj, form, change):
        obj._type = "Manager"
        super().save_model(request, obj, form, change)



class EmployeeAdmin(UserAdmin):
    inlines = [EmployeeProfileInline]
    def save_model(self, request, obj, form, change):
        obj._type= "Employee"
        super().save_model(request, obj, form, change)

class ClientAdmin(UserAdmin):
    inlines = [ClientProfileInline]
    def save_model(self, request, obj, form, change):
        obj._type = "Client"
        super().save_model(request, obj, form, change)


class CustomGroupAdmin(admin.ModelAdmin):
    filter_horizontal = ["permission"]
    list_display = ['name']

admin.site.unregister(Group)
admin.site.register(User,UserAdmin)
# admin.site.register(AdminProfile)
# admin.site.register(ManagerProfile)
# admin.site.register(EmployeeProfile)
# admin.site.register(ClientProfile)
admin.site.register(Admin,AdminAdmin)
admin.site.register(Manager,ManagerAdmin)
admin.site.register(Employee,EmployeeAdmin)
admin.site.register(Client,ClientAdmin)
admin.site.register(Groups,CustomGroupAdmin)
admin.site.register(Session)
admin.site.register(Address)



