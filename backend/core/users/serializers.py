from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


def _request_user(serializer):
    request = serializer.context.get('request')
    return getattr(request, 'user', None)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['role'] = self.user.role
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'first_name', 'last_name', 'is_active')
        read_only_fields = ('id',)

    def get_fields(self):
        fields = super().get_fields()
        user = _request_user(self)
        # Solo los admins pueden cambiar rol y estado de la cuenta
        if user is None or getattr(user, 'role', None) != 'admin':
            fields['role'].read_only = True
            fields['is_active'].read_only = True
        return fields


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'first_name', 'last_name', 'role')

    def validate_role(self, value):
        user = _request_user(self)
        if value == 'admin' and (user is None or getattr(user, 'role', None) != 'admin'):
            raise serializers.ValidationError('Only administrators can create admin users.')
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
