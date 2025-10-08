from rest_framework import generics, status
from rest_framework.response import Response
from ..serializers.leave import LeaveUpdateSerializer


class UpdateLeaveView(generics.UpdateAPIView):
    """
    UPDATE API to increase leave count for a given month and year.
    Supports POST and PUT.
    """
    def post(self, request, *args, **kwargs):
        serializer = LeaveUpdateSerializer(data=request.data)
        if serializer.is_valid():
            leave_record = serializer.create_or_update_leave(serializer.validated_data)
            employee = leave_record.employee
            return Response(
                {"message": f"Updated leave count to {leave_record.leaves} for {employee.name}."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)
