from django.db import models
from users.models import Business


class RawProductRecord(models.Model):
    STATUS_CHOICES = (
        ("raw", "Raw"),
        ("cleaning", "Cleaning"),
        ("cleaned", "Cleaned"),
        ("error", "Error"),
    )

    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name="raw_products")
    raw_row = models.JSONField()  
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="raw")
    error_message = models.TextField(blank=True, null=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)


class Product(models.Model):
    business=models.ForeignKey(Business,on_delete=models.CASCADE,related_name='products')
    name=models.CharField(max_length=255)
    sku=models.CharField(max_length=1000,blank=True,null=True)
    category=models.CharField(max_length=100,blank=True,null=True)
    price=models.FloatField(default=0)
    cost_price=models.FloatField(default=0)
    description=models.TextField(blank=True,null=True)
    attributes=models.JSONField(default=dict,blank=True)
    created_At=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}({self.business.name})"
    


    

class RawSalesRecord(models.Model):
    STATUS_CHOICE=(
        ('raw','Raw'),
        ('cleaning','Cleaning'),
        ('cleaned','Cleaned'),
        ('error','Error')
    )


    business=models.ForeignKey(Business,on_delete=models.CASCADE,related_name='raw_sales')
    raw_row=models.JSONField()
    status=models.CharField(max_length=20,choices=STATUS_CHOICE,default='raw')
    error_message=models.TextField(blank=True,null=True)

    uploaded_at = models.DateTimeField(auto_now_add=True)


class SalesRecord(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name="sales")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateField()
    quantity = models.IntegerField()
    revenue = models.FloatField()
    channel = models.CharField(max_length=50, default="offline")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} ({self.quantity} pcs)"