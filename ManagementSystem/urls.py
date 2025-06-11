from . import views
from django.urls import path

urlpatterns = [
    path("", views.home,name="home"),
    path("products-list",views.ProductsList.as_view()),
    path("period",views.PeriodView.as_view()),
    path("price-list",views.PriceListView.as_view()),

]