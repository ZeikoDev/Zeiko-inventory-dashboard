from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from core.users.views import UserViewSet, CustomTokenObtainPairView
from core.companies.views import CompanyViewSet
from core.products.views import ProductViewSet, trending_product_recommendation
from core.inventory.views import InventoryViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'products', ProductViewSet)
router.register(r'inventory', InventoryViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/products/recommendation/', trending_product_recommendation, name='product_recommendation'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')),
]
