# app/admin.py

from django.contrib import admin
from .models import Department, Employee, LeaveApplication

# Register the Department model
@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

# Register the Employee model
@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    # FIX: Changed 'baseSalary' to 'basesalary' to match the model
    list_display = ('id', 'name', 'department', 'basesalary')
    list_filter = ('department',)
    search_fields = ('name',)
    list_per_page = 20

# Register the LeaveApplication model
@admin.register(LeaveApplication)
class LeaveApplicationAdmin(admin.ModelAdmin):
    # FIX: Removed 'year' and 'leaveCount'.
    # Added 'display_year' (a custom method below) and 'leaves'.
    list_display = ('id', 'employee', 'month', 'display_year', 'leaves')
    list_filter = ('month', 'employee__department')
    search_fields = ('employee__name',)
    list_per_page = 20

    # This adds a custom 'Year' column to the admin view
    @admin.display(description='Year')
    def display_year(self, obj):
        if obj.month:
            return obj.month.year
        return 'N/A'