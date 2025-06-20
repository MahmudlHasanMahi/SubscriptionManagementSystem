from . import views
from django.urls import path

urlpatterns = [
    path("", views.home,name="home"),
    path("products",views.ProductsList.as_view()),
    path("product",views.ProductView.as_view()),
    path("product/<int:id>",views.ProductView.as_view()),
    path("periods",views.PeriodView.as_view()),
    path("price-lists",views.PriceListView.as_view()),
    path("subscriptions",views.SubscriptionListView.as_view()),
    path("subscription",views.SubscriptionView.as_view()),
    path("subscription/<int:id>",views.SubscriptionView.as_view()),
    path("test/<int:id>",views.test.as_view()),

]