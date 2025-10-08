# app/models.py
from ctypes.macholib.dylib import dylib_info
import uuid
from django import db
from django.db import models

class Department(models.Model):
    id = models.UUIDField(primary_key=True)
    name = models.TextField()
    class Meta:
        managed = False 
        db_table = 'department'

class Employee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    basesalary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='employees')
    class Meta:
        managed = False 
        db_table = 'employee'

class LeaveApplication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leaves')
    month = models.DateField()
    leaves = models.PositiveIntegerField(default=0)
    class Meta:
        unique_together = ('employee', 'month')
        managed = False
        db_table = 'leaveapplication'