
import uuid
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from app.utils.util import check_department_exists
from ..models import Department
from ..serializers.department import DepartmentSerializer

    
class DepartmentCreateView(generics.CreateAPIView):
    def post(self, request):
        try:
            data = request.data
            name = data.get("name")

            if not isinstance(name, str) or not name.strip():
                return Response(
                    {"error": "Field 'name' must be a non-empty string."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            name = name.strip()

            if check_department_exists(name):
                return Response(
                    {"error": f"Department '{name}' already exists."},
                    status=status.HTTP_409_CONFLICT
                )

            serializer = DepartmentSerializer(data={
            "id": uuid.uuid4(),
            "name": name
            })
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message" : f"Department '{name}' created successfully.",
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response(
            {"error": f"Unexpected error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )