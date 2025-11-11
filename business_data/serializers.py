from rest_framework import serializers
from .models import Campaign, Product, SalesRecord


class Productserializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ('id', 'business', 'created_at')


class ProductCSVUploadSerializer(serializers.Serializer):
    file = serializers.FileField()


class SalesRecordSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = SalesRecord
        fields = '__all__'
        read_only_fields = ('id', 'business', 'product', 'created_at', 'revenue')


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ('id', 'goal', 'budget', 'payload', 'created_at')
        read_only_fields = ('id', 'payload', 'created_at')