from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from .models import Inventory
from .serializers import InventorySerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.template.loader import render_to_string
from weasyprint import HTML
import tempfile
from django.core.mail import EmailMessage
from django.conf import settings
from core.products.models import Product
import os
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Inventory.objects.all()
        return Inventory.objects.filter(company__in=user.companies.all())

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        try:
            threshold = int(request.query_params.get('threshold', 10))
            inventory = self.get_queryset().filter(quantity__lte=threshold)
            serializer = self.get_serializer(inventory, many=True)
            return Response(serializer.data)
        except ValueError:
            return Response(
                {"error": "Invalid threshold value"},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'])
    def generate_pdf(self, request):
        try:
            inventory = self.get_queryset()
            # Crear directorio para templates si no existe
            template_dir = os.path.join(settings.BASE_DIR, 'templates', 'inventory')
            os.makedirs(template_dir, exist_ok=True)
            # Generar nombre único para el archivo
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'inventory_report_{timestamp}.pdf'
            # Renderizar template
            html_string = render_to_string('inventory/inventory_pdf.html', {
                'inventory': inventory,
                'generated_at': datetime.now(),
                'user': request.user
            })
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as output:
                HTML(string=html_string).write_pdf(output.name)
                if 'email' in request.data:
                    
                    if settings.DEBUG:
                        logger.info(f"Development mode: Simulating email to {request.data['email']}")
                        logger.info(f"PDF generated: {filename}")
                        dev_pdf_dir = os.path.join(settings.BASE_DIR, 'dev_pdfs')
                        os.makedirs(dev_pdf_dir, exist_ok=True)
                        dev_pdf_path = os.path.join(dev_pdf_dir, filename)
                        with open(output.name, 'rb') as src, open(dev_pdf_path, 'wb') as dst:
                            dst.write(src.read())
                        return Response({
                            'message': 'PDF generated and email simulated successfully',
                            'filename': filename,
                            'dev_mode': True,
                            'pdf_path': dev_pdf_path
                        })
                    else:
                
                        try:
                            email = EmailMessage(
                                'Inventory PDF Report',
                                'Please find attached the inventory report.',
                                settings.DEFAULT_FROM_EMAIL,
                                [request.data['email']],
                            )
                            email.attach(filename, open(output.name, 'rb').read(), 'application/pdf')
                            email.send()
                            return Response({
                                'message': 'PDF generated and sent successfully',
                                'filename': filename
                            })
                        except Exception as e:
                            logger.error(f"Failed to send email: {str(e)}")
                            return Response({
                                'error': f'Failed to send email: {str(e)}'
                            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  
                with open(output.name, 'rb') as pdf_file:
                    response = Response(pdf_file.read(), content_type='application/pdf')
                    response['Content-Disposition'] = f'attachment; filename="{filename}"'
                    return response
        except Exception as e:
            logger.error(f"Failed to generate PDF: {str(e)}")
            return Response({
                'error': f'Failed to generate PDF: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
