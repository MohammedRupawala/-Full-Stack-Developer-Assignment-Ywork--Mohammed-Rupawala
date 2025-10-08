from rest_framework import serializers
from ..models import LeaveApplication, Employee
import uuid

class LeaveUpdateSerializer(serializers.Serializer):
    employee_id = serializers.UUIDField()
    month = serializers.DateField()
    leaves = serializers.IntegerField(min_value=1)

    def validate_employee_id(self, value):
        if not Employee.objects.filter(id=value).exists():
            raise serializers.ValidationError("Employee not found.")
        return value

    def validate_leaves(self, value):
        # Reject string inputs explicitly (e.g., "5") coming from initial_data
        raw = None
        if getattr(self, 'initial_data', None):
            try:
                raw = self.initial_data.get('leaves', None)
            except Exception:
                raw = None
        if isinstance(raw, str):
            raise serializers.ValidationError("Leaves must be an integer, not a string.")
        if value <= 0:
            raise serializers.ValidationError("Leaves must be greater than zero.")
        return value

    def create_or_update_leave(self, validated_data):
        employee = Employee.objects.get(id=validated_data['employee_id'])
        month = validated_data['month']
        leaves = validated_data['leaves']

        leave_record, _ = LeaveApplication.objects.get_or_create(employee=employee, month=month)
        leave_record.leaves += leaves
        leave_record.save()
        return leave_record
