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
    path("subscription/clients",views.ClientView.as_view()),
    path("subscription/unapproved",views.SubscriptionApproval.as_view()),
    path("subscription/<int:id>/cancel",views.SubscriptionView.as_view(),{"action":"cancel"}),
    path("subscription/<int:pk>/approve",views.SubscriptionApproval.as_view(),{"action":"approve"}),
    path("subscription/<int:pk>/reject",views.SubscriptionApproval.as_view(),{"action":"reject"}),
    path("invoice/<int:pk>",views.Invoice.as_view()),
    path("invoice/<int:pk>/pay",views.Invoice.as_view(),{"action":"pay"}),
    path("invoice/<int:pk>/finalize",views.Invoice.as_view(),{"action":"finalize"}),
    path("invoice",views.Invoice.as_view()),
    path("invoices",views.InvoiceListView.as_view()),
    path("currencies/",views.CurrencyView.as_view()),
    path("test/",views.test.as_view()),
]