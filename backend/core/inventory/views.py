from rest_framework import viewsets, permissions, status
from .models import Inventory
from .serializers import InventorySerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.template.loader import render_to_string
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from weasyprint import HTML
from django.core.mail import EmailMessage
from django.conf import settings
from core.core.permissions import IsAdminOrReadOnly
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Inventory.objects.all()
        return Inventory.objects.filter(company__in=user.companies.all())

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        try:
            threshold = int(request.query_params.get('threshold', 10))
        except ValueError:
            return Response(
                {"error": "Invalid threshold value"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if threshold < 0:
            return Response(
                {"error": "Threshold must be a positive number"},
                status=status.HTTP_400_BAD_REQUEST
            )
        inventory = self.get_queryset().filter(quantity__lte=threshold)
        serializer = self.get_serializer(inventory, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def generate_pdf(self, request):
        recipient = request.data.get('email')
        if recipient:
            try:
                validate_email(recipient)
            except ValidationError:
                return Response(
                    {'error': 'Invalid email address.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        try:
            inventory = self.get_queryset()
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'inventory_report_{timestamp}.pdf'
            html_string = render_to_string('inventory/inventory_pdf.html', {
                'inventory': inventory,
                'generated_at': datetime.now(),
                'user': request.user
            })
            pdf_bytes = HTML(string=html_string).write_pdf()
        except Exception:
            logger.exception('Failed to generate inventory PDF')
            return Response(
                {'error': 'Failed to generate the PDF report.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if recipient:
            if settings.DEBUG:
                logger.info('Development mode: Simulating email to %s', recipient)
                dev_pdf_dir = os.path.join(settings.BASE_DIR, 'dev_pdfs')
                os.makedirs(dev_pdf_dir, exist_ok=True)
                with open(os.path.join(dev_pdf_dir, filename), 'wb') as dst:
                    dst.write(pdf_bytes)
                return Response({
                    'message': 'PDF generated and email simulated successfully',
                    'filename': filename,
                    'dev_mode': True,
                })
            try:
                email = EmailMessage(
                    'Inventory PDF Report',
                    'Please find attached the inventory report.',
                    settings.DEFAULT_FROM_EMAIL,
                    [recipient],
                )
                email.attach(filename, pdf_bytes, 'application/pdf')
                email.send()
                return Response({
                    'message': 'PDF generated and sent successfully',
                    'filename': filename
                })
            except Exception:
                logger.exception('Failed to send inventory report email')
                return Response(
                    {'error': 'The PDF was generated but the email could not be sent.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
