from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
import pandas as pd

from users.models import Business
from .serializers import ProductCSVUploadSerializer,Productserializer,SalesRecordSerializer
from .models import Product,RawProductRecord,SalesRecord,RawSalesRecord


class ProductListCreateView(APIView):
    permission_classes=[permissions.IsAuthenticated]

    def get_business(self,business_slug):
        return Business.objects.get(slug=business_slug)
    
    def get(self,request,business_slug):
        business=self.get_business(business_slug)
        self.check_object_permissions(request,business)

        products=Product.objects.filter(business=business)
        serializer=Productserializer(products,many=True)
        return Response(serializer.data)


    def post(self, request, business_slug):
            business = self.get_business(business_slug)
            self.check_object_permissions(request, business)

            serializer = Productserializer(data=request.data)
            if serializer.is_valid():
                serializer.save(business=business)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProductDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_business(self, business_slug):
        return Business.objects.get(slug=business_slug)

    def get_product(self, business, pk):
        return Product.objects.get(business=business, id=pk)

    def put(self, request, business_slug, pk):
        business = self.get_business(business_slug)
        self.check_object_permissions(request, business)

        product = self.get_product(business, pk)
        serializer = Productserializer(product, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save(business=business)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, business_slug, pk):
        business = self.get_business(business_slug)
        self.check_object_permissions(request, business)

        product = self.get_product(business, pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class ProductCSVUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    REQUIRED_FIELD = "name"

    def post(self, request, business_slug):
        business = Business.objects.get(slug=business_slug)
        self.check_object_permissions(request, business)

        serializer = ProductCSVUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file = serializer.validated_data["file"]
        df = pd.read_csv(file)

        results = {"created": 0, "updated": 0, "errors": 0}

        for _, row in df.iterrows():
            raw_data = row.to_dict()
            name = raw_data.get(self.REQUIRED_FIELD)

            raw_record = RawProductRecord.objects.create(
                business=business,
                raw_row=raw_data,
                status="raw"
            )

            if not name or str(name).strip() == "":
                raw_record.status = "error"
                raw_record.error_message = "Missing required product name"
                raw_record.save()
                results["errors"] += 1
                continue

            price = float(raw_data.get("price", 0) or 0)
            cost_price = float(raw_data.get("cost_price", 0) or 0)
            category = raw_data.get("category", "") or ""

            reserved = ["name", "price", "cost_price", "category"]
            attributes = {k: v for k, v in raw_data.items() if k not in reserved}

            product, created = Product.objects.update_or_create(
                business=business,
                name=name,
                defaults={
                    "price": price,
                    "cost_price": cost_price,
                    "category": category,
                    "attributes": attributes,
                }
            )

            raw_record.status = "cleaned"
            raw_record.save()

            if created:
                results["created"] += 1
            else:
                results["updated"] += 1

        return Response({
            "message": " Product import completed successfully",
            "summary": results
        }, status=status.HTTP_200_OK)


class SalesListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_business(self, business_slug):
        return Business.objects.get(slug=business_slug)

    def get(self, request, business_slug):
        business = self.get_business(business_slug)
        self.check_object_permissions(request, business)

        sales = SalesRecord.objects.filter(business=business).order_by("-date")
        serializer = SalesRecordSerializer(sales, many=True)
        return Response(serializer.data)

    def post(self, request, business_slug):
        business = self.get_business(business_slug)
        self.check_object_permissions(request, business)

        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 0))
        date = request.data.get("date")

        try:
            product = Product.objects.get(id=product_id, business=business)
        except Product.DoesNotExist:
            return Response({"error": "Invalid product"}, status=status.HTTP_400_BAD_REQUEST)

        if quantity <= 0:
            return Response({"error": "Quantity must be positive"}, status=status.HTTP_400_BAD_REQUEST)

        revenue = product.price * quantity  

        sale = SalesRecord.objects.create(
            business=business,
            product=product,
            quantity=quantity,
            date=date,
            revenue=revenue,
            channel="offline"
        )
        return Response(SalesRecordSerializer(sale).data, status=status.HTTP_201_CREATED)


class SalesDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_business(self, business_slug):
        return Business.objects.get(slug=business_slug)

    def get_object(self, business, pk):
        return SalesRecord.objects.get(business=business, id=pk)

    def put(self, request, business_slug, pk):
        business = self.get_business(business_slug)
        self.check_object_permissions(request, business)

        sale = self.get_object(business, pk)

        quantity = int(request.data.get("quantity", sale.quantity))
        date = request.data.get("date", sale.date)

        sale.quantity = quantity
        sale.date = date
        sale.revenue = sale.product.price * quantity  
        sale.save()

        return Response(SalesRecordSerializer(sale).data)

    def delete(self, request, business_slug, pk):
        business = self.get_business(business_slug)
        self.check_object_permissions(request, business)

        sale = self.get_object(business, pk)
        sale.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SalesCSVUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, business_slug):
        business = Business.objects.get(slug=business_slug)
        self.check_object_permissions(request, business)

        file = request.FILES.get("file")
        if not file:
            return Response({"error": "CSV file required"}, status=status.HTTP_400_BAD_REQUEST)

        df = pd.read_csv(file)

        results = {"cleaned": 0, "errors": 0}

        for _, row in df.iterrows():
            raw_data = row.to_dict()
            product_name = raw_data.get("product_name")
            quantity = raw_data.get("quantity")
            date = raw_data.get("date")
            revenue = raw_data.get("revenue") 

            raw_record = RawSalesRecord.objects.create(
                business=business,
                raw_row=raw_data
            )

            
            if not product_name or not date or not quantity:
                raw_record.status = "error"
                raw_record.error_message = "Missing required fields"
                raw_record.save()
                results["errors"] += 1
                continue

            quantity = int(quantity)
            product, _ = Product.objects.get_or_create(business=business, name=product_name)

            revenue = revenue or (product.price * quantity)

            SalesRecord.objects.create(
                business=business,
                product=product,
                quantity=quantity,
                date=date,
                revenue=revenue,
                channel="offline"
            )

            raw_record.status = "cleaned"
            raw_record.save()
            results["cleaned"] += 1

        return Response({
            "message": "Sales data import completed",
            "results": results
        })
