from django.db import models
from core.products.models import Product
from core.companies.models import Company

class Inventory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='inventories')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='inventories')
    quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} - {self.company.name} - {self.quantity}"

    class Meta:
        verbose_name = 'Inventory'
        verbose_name_plural = 'Inventories'
        unique_together = ('product', 'company')