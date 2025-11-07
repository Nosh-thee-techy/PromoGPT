from rest_framework import serializers
from .models import Product,SalesRecord

class Productserializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ("id", "business", "created_at")

class ProductCSVUploadSerializer(serializers.serializer):
    file=serializers.FileField()



class SalesRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesRecord
        fields = "__all__"
        read_only_fields = ("id", "business", "product", "created_at", "revenue")
