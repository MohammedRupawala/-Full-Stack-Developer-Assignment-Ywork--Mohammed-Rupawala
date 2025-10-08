from ..models import Department
def check_department_exists(name):
    return Department.objects.filter(name__iexact=name).exists()