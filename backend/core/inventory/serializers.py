from rest_framework import serializers
from .models import Inventory
from core.products.serializers import ProductSerializer
from core.companies.serializers import CompanySerializer

class InventorySerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    company_details = CompanySerializer(source='company', read_only=True)

    class Meta:
        model = Inventory
        fields = ('id', 'product', 'product_details', 'company', 'company_details', 
                 'quantity', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative")
        return value

    def validate(self, data):
        # Validar que el producto pertenece a la compañía
        if data.get('product') and data.get('company'):
            if data['product'].company != data['company']:
                raise serializers.ValidationError(
                    "The product must belong to the selected company"
                )
        return data 