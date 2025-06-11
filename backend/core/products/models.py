from django.db import models
from core.companies.models import Company
from decimal import Decimal

class Product(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    characteristics = models.TextField()
    price_usd = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    price_eur = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    price_cop = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='products')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Product'
        verbose_name_plural = 'Products'