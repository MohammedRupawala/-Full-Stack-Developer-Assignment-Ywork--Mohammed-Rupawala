from rest_framework import generics, status
from rest_framework.response import Response
from ..serializers.employee import EmployeeCreateSerializer, BaseSalarySerializer, HighEarnerDepartmentSerializer, HighEarnerMonthSerializer, SalaryCalculateSerializer
from ..models import Department, Employee, LeaveApplication


class EmployeeCreateView(generics.CreateAPIView):
    """
    POST API to create an employee.
    """
    def post(self, request):
        serializer = EmployeeCreateSerializer(data=request.data)
        if serializer.is_valid():
            employee = serializer.save()
            return Response(
                {"message": f"Employee '{employee.name}' created successfully."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SetBaseSalaryView(generics.UpdateAPIView):
    """
    POST API to set base salary for an employee.
    """
    def post(self, request):
        serializer = BaseSalarySerializer(data=request.data)
        if serializer.is_valid():
            employee_id = serializer.validated_data["employee_id"]
            base_salary = serializer.validated_data["base_salary"]

            employee = Employee.objects.get(id=employee_id)
            employee.basesalary = base_salary
            employee.save()

            return Response(
                {"message": f"Base salary set to {base_salary} for '{employee.name}'."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PayableSalaryView(generics.GenericAPIView):
    """
    POST API to calculate payable salary after leaves for a given month.
    """
    def post(self, request):
        serializer = SalaryCalculateSerializer(data=request.data)
        if serializer.is_valid():
            result = serializer.calculate_salary()
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class HighEarnersInDepartmentView(generics.GenericAPIView):
    """
    GET API to find top 3 high earners (unique base salaries) in a department.
    """
    def get(self, request):
        department_id = request.query_params.get("department_id")
        serializer = HighEarnerDepartmentSerializer(data={"department_id": department_id})
        if serializer.is_valid():
            dept_id = serializer.validated_data["department_id"]
            department = Department.objects.get(id=dept_id)
            employees = department.employees.all().order_by('-basesalary').values('id', 'name', 'basesalary')

            top_salaries = list({emp['basesalary'] for emp in employees})[:3]
            high_earners = [emp for emp in employees if emp['basesalary'] in top_salaries]

            return Response({
                "department": department.name,
                "high_earners": high_earners
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HighEarnersByMonthView(generics.GenericAPIView):
    """
    GET API to find top 3 high earners (by payable salary) in a specific month.
    """
    def get(self, request, month):
        serializer = HighEarnerMonthSerializer(data={"month": month})
        if serializer.is_valid():
            month = serializer.validated_data["month"]
            employees = Employee.objects.all()
            earners = []

            for emp in employees:
                base_salary = emp.basesalary if emp.basesalary is not None else 0.0
                leave_record = LeaveApplication.objects.filter(employee=emp, month=month).first()
                leaves = leave_record.leaves if leave_record and (leave_record.leaves is not None) else 0
                deduction = (base_salary / 30) * leaves if base_salary else 0
                payable = base_salary - deduction
                earners.append({
                    "name": emp.name,
                    "department": emp.department.name,
                    "payable_salary": payable
                })

            sorted_earners = sorted(earners, key=lambda x: x['payable_salary'], reverse=True)
            top3 = sorted_earners[:3]

            return Response({
                "month": month,
                "top_earners": top3
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)