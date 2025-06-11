from rest_framework import serializers
from .models import Company
from core.users.serializers import UserSerializer

class CompanySerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Company
        fields = ('id', 'nit', 'name', 'address', 'phone', 'user', 'user_details', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'user')

    def validate_nit(self, value):
        # Validar formato del NIT (ejemplo: 900123456-7)
        if not value.replace('-', '').isdigit():
            raise serializers.ValidationError("NIT must contain only numbers and one hyphen")
        return value

    def validate_phone(self, value):
        # Validar formato del teléfono
        if not value.replace('+', '').replace(' ', '').isdigit():
            raise serializers.ValidationError("Phone number must contain only numbers, spaces and '+'")
        return value 