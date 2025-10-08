# app/urls.py
from django.urls import path

from .views.department import DepartmentCreateView
from .views.leave import UpdateLeaveView
from .views.employee import EmployeeCreateView, SetBaseSalaryView, PayableSalaryView, HighEarnersInDepartmentView, HighEarnersByMonthView
# from app import .views.department, employee # Import the view modules
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


urlpatterns = [
    # Department URLs
    path('department', DepartmentCreateView.as_view(), name='create-department'),
    path("employee", EmployeeCreateView.as_view()),
    path("employee/salary/", SetBaseSalaryView.as_view()),
    path("leave/update/", UpdateLeaveView.as_view()),
    path("salary/calculate/", PayableSalaryView.as_view()),
    path("high-earners/", HighEarnersInDepartmentView.as_view()),
    path("high-earners/<str:month>/", HighEarnersByMonthView.as_view()),
    # YOUR DOCS ROUTES
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]