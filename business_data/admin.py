from django.contrib import admin
from .models import Campaign, Product, RawProductRecord, RawSalesRecord, SalesRecord


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'business', 'category', 'price')
    search_fields = ('name', 'business__name', 'category')
    list_filter = ('business', 'category')


@admin.register(SalesRecord)
class SalesRecordAdmin(admin.ModelAdmin):
    list_display = ('product', 'business', 'date', 'quantity', 'revenue')
    list_filter = ('business', 'date')
    search_fields = ('product__name',)


@admin.register(RawProductRecord)
class RawProductRecordAdmin(admin.ModelAdmin):
    list_display = ('business', 'status', 'uploaded_at')
    list_filter = ('status', 'business')


@admin.register(RawSalesRecord)
class RawSalesRecordAdmin(admin.ModelAdmin):
    list_display = ('business', 'status', 'uploaded_at')
    list_filter = ('status', 'business')


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('business', 'goal', 'budget', 'created_at')
    list_filter = ('business', 'created_at')
    search_fields = ('goal', 'business__name')