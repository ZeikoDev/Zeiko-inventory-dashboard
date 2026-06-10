import logging

from django.core.exceptions import PermissionDenied
from django.db import IntegrityError
from django.http import Http404
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Devuelve errores JSON consistentes y nunca filtra detalles internos.

    Formato de respuesta:
        {"error": {"message": "...", "details": {...}, "status_code": 400}}
    """
    response = drf_exception_handler(exc, context)

    if response is not None:
        # Errores manejados por DRF (validación, auth, permisos, 404...)
        if isinstance(response.data, dict) and 'detail' in response.data:
            message = str(response.data['detail'])
            details = None
        else:
            message = 'Validation error.'
            details = response.data
        response.data = {
            'error': {
                'message': message,
                'details': details,
                'status_code': response.status_code,
            }
        }
        return response

    # Errores no manejados: registrar el detalle, responder genérico
    view = context.get('view')
    logger.exception(
        'Unhandled exception in %s', view.__class__.__name__ if view else 'unknown view'
    )

    if isinstance(exc, Http404):
        return Response(
            {'error': {'message': 'Resource not found.', 'details': None,
                       'status_code': status.HTTP_404_NOT_FOUND}},
            status=status.HTTP_404_NOT_FOUND,
        )
    if isinstance(exc, PermissionDenied):
        return Response(
            {'error': {'message': 'Permission denied.', 'details': None,
                       'status_code': status.HTTP_403_FORBIDDEN}},
            status=status.HTTP_403_FORBIDDEN,
        )
    if isinstance(exc, IntegrityError):
        return Response(
            {'error': {'message': 'The request conflicts with existing data.',
                       'details': None,
                       'status_code': status.HTTP_409_CONFLICT}},
            status=status.HTTP_409_CONFLICT,
        )

    return Response(
        {'error': {'message': 'An internal server error occurred.', 'details': None,
                   'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR}},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


class ServiceUnavailable(APIException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = 'External service temporarily unavailable.'
    default_code = 'service_unavailable'
