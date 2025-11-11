from django.urls import path
from .views import (
    ProductListCreateView,
    ProductDetailView,
    ProductCSVUploadView,
    SalesListCreateView,
    SalesDetailView,
    SalesCSVUploadView,
    CampaignListCreateView,
)

urlpatterns = [
    path('<slug:business_slug>/products/', ProductListCreateView.as_view()),
    path('<slug:business_slug>/products/<int:pk>/', ProductDetailView.as_view()),
    path('<slug:business_slug>/products/upload/', ProductCSVUploadView.as_view()),
    path('<slug:business_slug>/sales/', SalesListCreateView.as_view()),
    path('<slug:business_slug>/sales/<int:pk>/', SalesDetailView.as_view()),
    path('<slug:business_slug>/sales/upload/', SalesCSVUploadView.as_view()),
    path('<slug:business_slug>/campaigns/', CampaignListCreateView.as_view()),
]