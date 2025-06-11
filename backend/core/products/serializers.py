from rest_framework import serializers
from .models import Product
from core.companies.serializers import CompanySerializer

class ProductSerializer(serializers.ModelSerializer):
    company_details = CompanySerializer(source='company', read_only=True)

    class Meta:
        model = Product
        fields = ('id', 'code', 'name', 'characteristics', 'price_usd', 'price_eur', 'price_cop', 
                 'company', 'company_details', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate(self, data):
        if data.get('price_usd', 0) < 0 or data.get('price_eur', 0) < 0 or data.get('price_cop', 0) < 0:
            raise serializers.ValidationError("Prices cannot be negative")
        return data