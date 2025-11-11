from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

try:
    import pandas as pd
except ImportError:
    pd = None

from rest_framework import permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from users.models import Business
from .aiservice import CampaignGenerator
from .models import Product, RawProductRecord, SalesRecord, RawSalesRecord
from .serializers import (
    CampaignSerializer,
    ProductCSVUploadSerializer,
    Productserializer,
    SalesRecordSerializer,
)


class BusinessScopedAPIView(APIView):
    """Base view for business-scoped API endpoints"""
    permission_classes = [permissions.IsAuthenticated]

    def get_business(self, request, business_slug):
        """Get business and check permissions"""
        business = get_object_or_404(Business, slug=business_slug)
        has_membership = business.owner_id == request.user.id or business.members.filter(
            user=request.user
        ).exists()

        if not has_membership:
            raise PermissionDenied('You do not have access to this business.')

        return business


class ProductListCreateView(BusinessScopedAPIView):
    """List and create products"""

    def get(self, request, business_slug):
        business = self.get_business(request, business_slug)
        products = Product.objects.filter(business=business)
        serializer = Productserializer(products, many=True)
        return Response(serializer.data)

    def post(self, request, business_slug):
        business = self.get_business(request, business_slug)
        serializer = Productserializer(data=request.data)
        if serializer.is_valid():
            serializer.save(business=business)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(BusinessScopedAPIView):
    """Retrieve, update and delete individual products"""

    def put(self, request, business_slug, pk):
        business = self.get_business(request, business_slug)
        product = get_object_or_404(Product, business=business, id=pk)
        serializer = Productserializer(product, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save(business=business)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, business_slug, pk):
        business = self.get_business(request, business_slug)
        product = get_object_or_404(Product, business=business, id=pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductCSVUploadView(BusinessScopedAPIView):
    """Upload product CSV files"""
    REQUIRED_FIELD = 'name'

    def post(self, request, business_slug):
        business = self.get_business(request, business_slug)

        serializer = ProductCSVUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file = serializer.validated_data['file']

        if pd is None:
            return Response(
                {'error': 'CSV uploads require pandas. Install pandas to continue.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            df = pd.read_csv(file)
        except Exception as exc:
            return Response(
                {'error': f'Unable to read CSV file: {exc}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        results = {'created': 0, 'updated': 0, 'errors': 0}

        for _, row in df.iterrows():
            raw_data = row.to_dict()
            name = raw_data.get(self.REQUIRED_FIELD)

            raw_record = RawProductRecord.objects.create(
                business=business,
                raw_row=raw_data,
                status='raw',
            )

            if not name or str(name).strip() == '':
                raw_record.status = 'error'
                raw_record.error_message = 'Missing required product name'
                raw_record.save()
                results['errors'] += 1
                continue

            price = float(raw_data.get('price', 0) or 0)
            cost_price = float(raw_data.get('cost_price', 0) or 0)
            category = raw_data.get('category', '') or ''

            reserved = {'name', 'price', 'cost_price', 'category'}
            attributes = {k: v for k, v in raw_data.items() if k not in reserved}

            product, created = Product.objects.update_or_create(
                business=business,
                name=name,
                defaults={
                    'price': price,
                    'cost_price': cost_price,
                    'category': category,
                    'attributes': attributes,
                },
            )

            raw_record.status = 'cleaned'
            raw_record.save()

            if created:
                results['created'] += 1
            else:
                results['updated'] += 1

        return Response(
            {'message': 'Product import completed successfully', 'summary': results}
        )


class SalesListCreateView(BusinessScopedAPIView):
    """List and create sales records"""

    def get(self, request, business_slug):
        business = self.get_business(request, business_slug)
        sales = SalesRecord.objects.filter(business=business).order_by('-date')
        serializer = SalesRecordSerializer(sales, many=True)
        return Response(serializer.data)

    def post(self, request, business_slug):
        business = self.get_business(request, business_slug)

        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 0)
        date = request.data.get('date')

        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {'error': 'Quantity must be a whole number'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity <= 0:
            return Response(
                {'error': 'Quantity must be positive'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        product = get_object_or_404(Product, id=product_id, business=business)
        revenue = product.price * quantity

        sale = SalesRecord.objects.create(
            business=business,
            product=product,
            quantity=quantity,
            date=date,
            revenue=revenue,
            channel=request.data.get('channel', 'offline'),
        )
        return Response(SalesRecordSerializer(sale).data, status=status.HTTP_201_CREATED)


class SalesDetailView(BusinessScopedAPIView):
    """Retrieve, update and delete individual sales records"""

    def put(self, request, business_slug, pk):
        business = self.get_business(request, business_slug)
        sale = get_object_or_404(SalesRecord, business=business, id=pk)

        quantity = request.data.get('quantity', sale.quantity)
        try:
            quantity = int(quantity)
        except (TypeError, ValueError):
            return Response(
                {'error': 'Quantity must be a whole number'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if quantity <= 0:
            return Response(
                {'error': 'Quantity must be positive'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sale.quantity = quantity
        sale.date = request.data.get('date', sale.date)
        sale.revenue = sale.product.price * quantity
        sale.save()

        return Response(SalesRecordSerializer(sale).data)

    def delete(self, request, business_slug, pk):
        business = self.get_business(request, business_slug)
        sale = get_object_or_404(SalesRecord, business=business, id=pk)
        sale.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SalesCSVUploadView(BusinessScopedAPIView):
    """Upload sales CSV files"""

    def post(self, request, business_slug):
        business = self.get_business(request, business_slug)

        file = request.FILES.get('file')
        if not file:
            return Response(
                {'error': 'CSV file required'}, status=status.HTTP_400_BAD_REQUEST
            )

        if pd is None:
            return Response(
                {'error': 'CSV uploads require pandas. Install pandas to continue.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            df = pd.read_csv(file)
        except Exception as exc:
            return Response(
                {'error': f'Unable to read CSV file: {exc}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        results = {'cleaned': 0, 'errors': 0}

        for _, row in df.iterrows():
            raw_data = row.to_dict()
            product_name = raw_data.get('product_name')
            quantity = raw_data.get('quantity')
            date = raw_data.get('date')
            revenue = raw_data.get('revenue')

            raw_record = RawSalesRecord.objects.create(
                business=business,
                raw_row=raw_data,
            )

            if not product_name or not date or not quantity:
                raw_record.status = 'error'
                raw_record.error_message = 'Missing required fields'
                raw_record.save()
                results['errors'] += 1
                continue

            try:
                quantity = int(quantity)
            except (TypeError, ValueError):
                raw_record.status = 'error'
                raw_record.error_message = 'Quantity must be a number'
                raw_record.save()
                results['errors'] += 1
                continue

            product, _ = Product.objects.get_or_create(
                business=business, name=product_name
            )
            calculated_revenue = product.price * quantity
            revenue_value = float(revenue) if revenue else calculated_revenue

            SalesRecord.objects.create(
                business=business,
                product=product,
                quantity=quantity,
                date=date,
                revenue=revenue_value,
                channel=raw_data.get('channel', 'offline'),
            )

            raw_record.status = 'cleaned'
            raw_record.save()
            results['cleaned'] += 1

        return Response({'message': 'Sales data import completed', 'results': results})


class CampaignListCreateView(BusinessScopedAPIView):
    """List and generate campaigns"""

    def get(self, request, business_slug):
        business = self.get_business(request, business_slug)
        campaigns = business.campaigns.all()
        serializer = CampaignSerializer(campaigns, many=True)
        return Response(serializer.data)

    def post(self, request, business_slug):
        business = self.get_business(request, business_slug)
        serializer = CampaignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        goal = serializer.validated_data['goal']
        budget = serializer.validated_data['budget']

        generator = CampaignGenerator(business)
        plan = generator.generate_campaign(goal=goal, budget=budget)

        campaign = business.campaigns.create(
            goal=goal,
            budget=budget,
            payload=plan,
            created_by=request.user,
        )

        return Response(
            CampaignSerializer(campaign).data, status=status.HTTP_201_CREATED
        )