from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Company
from .serializers import CompanySerializer
from core.products.models import Product
from core.products.serializers import ProductSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Company.objects.all()
        return user.companies.all()

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        company = self.get_object()
        products = Product.objects.filter(company=company)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    def get_permissions(self):
        if self.action in ['destroy', 'create', 'update', 'partial_update']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.request.user.is_authenticated and self.request.user.role == 'admin':
            return Company.objects.all()
        return Company.objects.all()  

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  