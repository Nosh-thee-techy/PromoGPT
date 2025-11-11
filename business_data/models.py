from django.conf import settings
from django.db import models
from users.models import Business


class RawProductRecord(models.Model):
    STATUS_CHOICES = (
        ('raw', 'Raw'),
        ('cleaning', 'Cleaning'),
        ('cleaned', 'Cleaned'),
        ('error', 'Error'),
    )

    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='raw_products')
    raw_row = models.JSONField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='raw')
    error_message = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Raw Product Record for {self.business.name} - {self.status}"


class Product(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=1000, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    price = models.FloatField(default=0)
    cost_price = models.FloatField(default=0)
    attributes = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.business.name}"


class RawSalesRecord(models.Model):
    STATUS_CHOICES = (
        ('raw', 'Raw'),
        ('cleaning', 'Cleaning'),
        ('cleaned', 'Cleaned'),
        ('error', 'Error')
    )

    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='raw_sales')
    raw_row = models.JSONField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='raw')
    error_message = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Raw Sales Record for {self.business.name} - {self.status}"


class SalesRecord(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='sales')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateField()
    quantity = models.IntegerField()
    revenue = models.FloatField()
    channel = models.CharField(max_length=50, default='offline')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} ({self.quantity} pcs)"


class Campaign(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='campaigns')
    goal = models.CharField(max_length=255)
    budget = models.FloatField()
    payload = models.JSONField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='generated_campaigns',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f"Campaign for {self.business.name} ({self.goal})"