from email.mime import base
from rest_framework import serializers
from ..models import Employee, Department, LeaveApplication
import uuid
from decimal import Decimal, ROUND_HALF_UP

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'name', 'base_salary', 'department']

class EmployeeCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    department = serializers.UUIDField()

    def validate_department(self, value):
        if not Department.objects.filter(id=value).exists():
            raise serializers.ValidationError("Department not found.")
        return value

    def validate(self, attrs):
        name = attrs.get('name', '').strip()
        dept_id = attrs.get('department')
        # check for existing employee with same name (case-insensitive) in the same department
        if dept_id and Employee.objects.filter(name__iexact=name, department_id=dept_id).exists():
            raise serializers.ValidationError("Employee with this name already exists in the department.")
        attrs['name'] = name
        return attrs

    def create(self, validated_data):
        department = Department.objects.get(id=validated_data['department'])
        employee = Employee.objects.create(
            id=uuid.uuid4(),
            name=validated_data['name'],
            department=department,
        )
        return employee


class BaseSalarySerializer(serializers.Serializer):
    employee_id = serializers.UUIDField()
    base_salary = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate_employee_id(self, value):
        if not Employee.objects.filter(id=value).exists():
            raise serializers.ValidationError("Employee not found.")
        return value

    def validate_base_salary(self, value):
        # Ensure the raw input was not a string (e.g. "1000") but a numeric JSON type
        raw = self.initial_data.get('base_salary', None)
        if isinstance(raw, str):
            raise serializers.ValidationError("Base salary must be a number, not a string.")
        # Ensure value is positive
        if value < 0:
            raise serializers.ValidationError("Base salary must be positive.")
        return value
    


class SalaryCalculateSerializer(serializers.Serializer):
    employee_id = serializers.UUIDField()
    month = serializers.DateField()

    def validate_employee_id(self, value):
        if not Employee.objects.filter(id=value).exists():
            raise serializers.ValidationError("Employee not found.")
        return value

    def calculate_salary(self):
        employee = Employee.objects.get(id=self.validated_data['employee_id'])
        month = self.validated_data['month']
        leave_record = LeaveApplication.objects.filter(employee=employee, month=month).first()

        total_leaves = leave_record.leaves if leave_record else 0
        deduction = (employee.basesalary / 30) * total_leaves
        payable_salary = (employee.basesalary - deduction).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        return {
            "employee_id": employee.name,
            "month": month,
            "basesalary": employee.basesalary,
            "leaves": total_leaves,
            "payable_salary": payable_salary
        }



class HighEarnerDepartmentSerializer(serializers.Serializer):
    department_id = serializers.UUIDField()

    def validate_department_id(self, value):
        if not Department.objects.filter(id=value).exists():
            raise serializers.ValidationError("Department not found.")
        return value


class HighEarnerMonthSerializer(serializers.Serializer):
    month = serializers.DateField()