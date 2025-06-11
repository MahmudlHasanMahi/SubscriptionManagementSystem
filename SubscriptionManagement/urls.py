from django.contrib import admin
from django.urls import path,include,re_path

urlpatterns = [
    
    path("admin/", admin.site.urls),
    path("",include("ManagementSystem.urls")),
    path("user/",include("User.urls")),
    re_path(r'^yasier/.*$',include("Frontend.urls"))

]
