from rest_framework import viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Product
from .serializers import ProductSerializer
from core.inventory.models import Inventory
from core.core.permissions import IsAdminOrReadOnly
from rest_framework.permissions import IsAuthenticated
import requests
import os
import logging

logger = logging.getLogger(__name__)

MAX_DESCRIPTION_LENGTH = 1000


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Product.objects.all()
        return Product.objects.filter(company__in=user.companies.all())

    @action(detail=True, methods=['get'])
    def inventory(self, request, pk=None):
        product = self.get_object()
        inventory = Inventory.objects.filter(product=product)
        return Response({
            'product': ProductSerializer(product).data,
            'inventory': [{'company': inv.company.name, 'quantity': inv.quantity} for inv in inventory]
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def trending_product_recommendation(request):
    description = request.query_params.get('description')
    if not description or not description.strip():
        return Response({'error': 'Missing company description.'}, status=400)
    if len(description) > MAX_DESCRIPTION_LENGTH:
        return Response({'error': 'Description is too long.'}, status=400)

    openai_api_key = os.environ.get('OPENAI_API_KEY')
    if not openai_api_key:
        logger.error('OPENAI_API_KEY is not configured')
        return Response({'error': 'Recommendation service is not available.'}, status=503)

    prompt = f"""
You are an AI that recommends the best dropshipping products based on the type of business the user has.
Based on the company description, suggest 3 to 5 trending and profitable dropshipping products that match their niche.
Consider:
- Current product trends
- Market demand
- Shipping ease and supplier availability (AliExpress, CJ Dropshipping, etc.)
- Competition level
- Average price range of the niche
For each product, include a short explanation of why it's a good fit.
If helpful, suggest keywords for further research on TikTok, Google Trends, or Amazon.

User company description: {description}
"""
    try:
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {openai_api_key}',
                'Content-Type': 'application/json',
            },
            json={
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {"role": "system", "content": "You are an AI that recommends the best dropshipping products based on the type of business the user has."},
                    {"role": "user", "content": prompt}
                ],
                'max_tokens': 600,
                'temperature': 0.7
            },
            timeout=30,
        )
        data = response.json()
        if response.status_code == 200 and 'choices' in data:
            recommendation = data['choices'][0]['message']['content']
            return Response({'recommendation': recommendation})
        # No exponer la respuesta cruda del proveedor al cliente
        logger.error('OpenAI API error (status %s): %s', response.status_code, data)
        return Response({'error': 'Could not generate a recommendation right now.'}, status=502)
    except requests.RequestException:
        logger.exception('Failed to reach OpenAI API')
        return Response({'error': 'Recommendation service is temporarily unavailable.'}, status=503)
