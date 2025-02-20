from django.urls import path,include
from . import views
urlpatterns = [
    path("getCSRFToken",views.GetCSRFToken.as_view()),
    path("signup",views.SignUp.as_view()),
    path("signOut",views.Signout.as_view()),
    path("checkAuthentication", views.CheckAuthentication.as_view()),
    path("resetPassword",views.ResetPassword.as_view()),
    path("staff-list",views.StaffList.as_view()),
    path("staff/<int:id>",views.StaffView.as_view()),
    path("groups", views.GroupsView.as_view()),
    path("create-staff",views.CreateStaffView.as_view()),
    path("test",views.test.as_view())
    
]