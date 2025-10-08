# Payroll & Leave Management — Request-only API Reference

This file lists the API endpoints and required request bodies or query parameters only. It reflects the current routes exposed in `app/urls.py` and assumes UUID primary keys and snake_case column names (as in your Supabase schema).

Base URL (default): http://127.0.0.1:8000
Prefix: `/api/` (your `app/urls.py` uses root paths under `/` — adjust if you mount under `/api/`)


---

Routes and request bodies

1) Create Department
- URL: POST `/department`

Request body:

```json
{ "name": "Engineering" }
```

2) Create Employee
- URL: POST `/employee`

Request body (use department UUID):

```json
{
  "name": "Amit Sharma",
  "departmentId": "11111111-2222-3333-4444-555555555555"
}
```

3) Set / Update Employee Base Salary
- URL: POST `/employee/salary/`


```json
{
  "employee_id": "6f1a1b2e-3d4a-4b2f-a2b1-1234567890ab",
  "basesalary": 55000
}
```

4) Update / Increase Leave Count
- URL: PUT `/leave/update/`

Request body:

```json
{
  "employee_id": "6f1a1b2e-3d4a-4b2f-a2b1-1234567890ab",
  "month": "2025-09-01",   // or provide integers month/year depending on API
  "leaves": 2
}
```

5) Calculate Payable Salary for a Given Month
- URL: POST `/salary/calculate/`

Request body:

```json
{
  "employee_id": "6f1a1b2e-3d4a-4b2f-a2b1-1234567890ab",
  "month": "2025-09-01"
}
```

6) High Earners in a Department
- URL: GET `/high-earners/`

Note: your `app/urls.py` also exposes a non-parameterized `high-earners/` route. If you intend to pass a department ID, use the department-specific variant below or supply a query param depending on the view.

If your implementation expects a department path param, call:

GET `/high-earners/{department_id}/`

Example (no request body):

```
GET /high-earners/11111111-2222-3333-4444-555555555555/
```

7) High Earners for a Specific Month (monthly)
- URL (query params): GET `/high-earners/monthly/?month=MM&year=YYYY`

OR
- URL (path param): GET `/high-earners/<str:month>/` where `month` can be `YYYY-MM` or `YYYY-MM-DD` (recommended `YYYY-MM`)

No request body.

---

If you want, I can also:
- produce a Postman collection JSON with these requests and placeholder UUIDs
- normalize the request field names to match your DB exactly (employee_id / department_id / basesalary / leaves)
- add short examples of expected responses (separate file) for easier Postman assertions
# Payroll & Leave Management API — Request-only Reference

This document lists the API endpoints and the required request bodies or query parameters only. It assumes the database schema uses UUID primary keys and snake_case column names (as in Supabase). The `leaveapplication.month` column stores a date; the API maps (month, year) integers to the first day of that month when reading/writing.

Base URL (default): http://127.0.0.1:8000

All requests and responses are JSON. Below are request examples (bodies or query params) only.

---

1) Create Department
- URL: POST `/department`

Request body:

```json
{ "name": "Engineering" }
```

2) Create Employee
- URL: POST `/employee`

Request body (use department UUID):

```json
{
  "name": "Amit Sharma",
  "departmentId": "11111111-2222-3333-4444-555555555555"
}
```

3) Set / Update Employee Base Salary
- URL: POST `/employee/set-salary/` 
Request body:

```json
{ 
    "baseSalary": 55000,
    "employee_id" : "11111111-2222-3333-4444-555555555555",
}
```

4) Update / Increase Leave Count
- URL: PUT `/leave/update/`

Request body (API maps month/year -> `YYYY-MM-01` when storing in DB):

```json
{
    "employee_id" : "f3eac187-dd21-4082-b6db-959fcc686797",
    "month" : "2025-07-07",
    "leaves" : 5
}
```

5) Calculate Payable Salary for a Given Month
- URL: POST `/salary/calculate/`

Request body:

```json
{
    "employee_id" : "f3eac187-dd21-4082-b6db-959fcc686797",
    "month" : "2025-07-07"
}
```

6) High Earners in a Department
- URL: GET `/high-earners/{department_id}/` (department_id is a UUID path param)

No request body.

7) High Earners for a Specific Month (monthly)
- URL: GET `/high-earners/monthly/?month=YYYY-MM-DD`

Query parameters (required):
- `month` (date)

---

Notes
- The API accepts month/year as integers for convenience. Internally the code converts them to a `date` representing the first day of the month (e.g., 2025-09-01) to match the `leaveapplication.month` date column in Supabase.
- Use UUIDs for IDs when interacting with Supabase-backed tables.
# Payroll & Leave Management API (Django REST Framework)

This repository contains a production-ready Django REST Framework backend for a Payroll and Leave Management System. The API is designed for testing with Postman and follows the Model → Serializer → View → URL architecture.

Key features
- Department, Employee and LeaveApplication models
- Salary management and dynamic payable-salary calculation using exact provided formula
- Leave update endpoint (incremental)
- High-earners endpoints (department-level and monthly)
- Proper request validation and JSON responses with appropriate HTTP status codes


---

## Quick start (Windows PowerShell)

1. Create and activate a virtual environment and install dependencies

```powershell
cd d:\Code\Ywork-Assignment\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install django djangorestframework python-dotenv dj-database-url
```

2. Environment (optional)
- You can use SQLite (default) or configure Supabase/Postgres using a `SUPABASE_URL` in a `.env` file. A sample `.env` is present in the repo.

3. Run migrations and start the server

```powershell
python manage.py migrate
python manage.py runserver
```

4. Run tests

```powershell
python manage.py test
```

---

## Database / Models (overview)

- Department (table: `department`)
  - id: uuid (primary key)
  - name: text

- Employee (table: `employee`)
  - id: uuid (primary key)
  - name: text
  - basesalary: numeric/decimal (nullable until set)
  - department_id: uuid (foreign key to `department.id`)

- LeaveApplication (table: `leaveapplication`)
  - id: uuid (primary key)
  - employee_id: uuid (foreign key to `employee.id`)
  - month: date (the table stores a date; by convention we store the first day of the month for monthly records)
  - leaves: integer (number of leaves in that month)

Salary formula (exact):

payableSalary = baseSalary - (leaveCount × (baseSalary / 25))

Notes:
- Calculated salary values are computed dynamically and not stored permanently.

Schema notes & mapping to the API
- The Supabase tables use snake_case column names and UUID primary keys (as shown in your diagram).
- The API accepts month and year as integers and internally maps them to a date representing the first day of the month (e.g., month=9, year=2025 -> `2025-09-01`) to match the `leaveapplication.month` date column.


---

## API Reference

All endpoints accept and return JSON. Use these paths (server root: http://127.0.0.1:8000 by default).

Base path prefix: `/`

### 1) Create Department
- URL: POST `/department/`
- Purpose: Create a new department

Request body (application/json):

```json
{ "name": "Engineering" }
```

Response (Success, 201 Created):

```json
{ "id": 1, "name": "Engineering" }
```

Error responses:
- 400 Bad Request: validation errors (e.g., missing name or duplicate name)

### 2) Create Employee
- URL: POST `/employee/`
- Purpose: Create a new employee record

Request body:

```json
{
  "name": "Amit Sharma",
  "departmentId": 1
}
```

Response (Success, 201 Created):

```json
{
  "id": 1,
  "name": "Amit Sharma",
  "departmentId": 1,
  "baseSalary": null
}
```

Errors:
- 400 Bad Request: invalid departmentId, missing fields

### 3) Set / Update Employee Base Salary
- URL: POST `/employee/{id}/set_salary/`
- Purpose: Set or update an employee's base salary. Use employee's numeric/UUID id in the path.

Request body:

```json
{ "baseSalary": 55000 }
```

Response (Success, 200 OK):

```json
{
  "id": 1,
  "name": "Amit Sharma",
  "departmentId": 1,
  "baseSalary": "55000.00"
}
```

Errors:
- 404 Not Found: employee ID not found
- 400 Bad Request: invalid salary format

### 4) Update/Increase Leave Count
- URL: PUT `/leave/update/`
- Purpose: Increase (add to) leave count for an employee for a given month and year. If no record exists for that month/year it will be created.

Request body:

```json
{
  "employeeId": 1,
  "month": 9,
  "year": 2025,
  "leaveCount": 2
}
```

Behavior: leaveCount is added to the existing leaveCount for that employee/month/year.

Response (Success, 200 OK):

```json
{
  "id": 7,
  "employeeId": 1,
  "month": 9,
  "year": 2025,
  "leaveCount": 2
}
```

Errors:
- 400 Bad Request: invalid payload (month not in 1..12, negative leaveCount, etc.)
- 404 Not Found: employeeId not found

### 5) Calculate Payable Salary for a Given Month
- URL: POST `/salary/calculate/`
- Purpose: Compute payable salary for an employee in a given month and year using the provided formula. This does not persist the computed salary.

Request body:

```json
{
  "employeeId": 1,
  "month": 9,
  "year": 2025
}
```

Response (Success, 200 OK):

```json
{
  "employeeId": 1,
  "month": 9,
  "year": 2025,
  "baseSalary": "55000.00",
  "leaveCount": 2,
  "payableSalary": "50600.00"
}
```

Notes: If the employee has no leave record for that month/year, leaveCount is treated as 0.

Errors:
- 404 Not Found: employee not found
- 400 Bad Request: baseSalary not set for employee

### 6) High Earners in a Department
- URL: GET `/high-earners/{department_id}/`
- Purpose: Return employees in that department whose baseSalary is within the top 3 unique baseSalary values for the department (descending). Returns employees matching those top unique salaries (there may be more than 3 employees if ties exist).

Example response (200 OK):

```json
{
  "departmentId": 1,
  "highEarners": [
    { "id": 5, "name": "Priya Nair", "departmentId": 1, "baseSalary": "75000.00" },
    { "id": 3, "name": "Rohan Verma", "departmentId": 1, "baseSalary": "60000.00" }
  ]
}
```

Errors:
- 404 Not Found: department not found

### 7) High Earners for a Specific Month (monthly)
- URL: GET `/high-earners/monthly/?month=MM&year=YYYY`
- Purpose: Compute payable salaries for all employees (baseSalary - leave deductions) for the given month/year and return employees whose payableSalary is within the top 3 unique payable values.

Query parameters (required):
- month: integer (1..12)
- year: integer (e.g., 2025)

Example response (200 OK):

```json
{
  "month": 9,
  "year": 2025,
  "highEarners": [
    {
      "employeeId": 5,
      "name": "Priya Nair",
      "departmentId": 1,
      "baseSalary": "75000.00",
      "payableSalary": "73200.00"
    },
    {
      "employeeId": 3,
      "name": "Rohan Verma",
      "departmentId": 2,
      "baseSalary": "60000.00",
      "payableSalary": "58000.00"
    }
  ]
}
```

Errors:
- 400 Bad Request: missing or invalid `month`/`year` params

---

## Error responses (summary)

- 400 Bad Request — validation errors (missing fields, invalid types, invalid month/year ranges, salary format errors)
- 404 Not Found — referenced record (employee or department) not found
- 500 Internal Server Error — unexpected errors (should be rare; check server logs)

All errors return a JSON object with a `detail` or serializer error messages.

---

## Postman tips / Testing flow

Typical flow to test in Postman:
1. POST `/department/` → create department "Engineering" (response gives id)
2. POST `/employee/` → create Amit Sharma with departmentId from step 1
3. POST `/employee/{id}/set_salary/` → set baseSalary to 55000
4. PUT `/leave/update/` → add 2 leaves for Sept 2025
5. POST `/salary/calculate/` → calculate payable salary for Sept 2025
6. GET `/high-earners/{department_id}/` to check top 3 unique base salaries
7. GET `/high-earners/monthly/?month=9&year=2025` to check monthly high earners

Example Postman body type: select `raw` → `JSON` for request bodies.

---

## Notes & next steps

- The project defaults to SQLite for local testing, and supports Supabase/Postgres if `SUPABASE_URL` or `DATABASE_URL` is provided and `dj-database-url` is configured.
- Consider adding an OpenAPI/Swagger UI (drf-spectacular or drf-yasg) for interactive API docs.
- Additional production hardening: authentication, permissions, pagination, rate-limiting and logging.

If you'd like, I can add Postman collection JSON for import, openapi schema, or expand tests to cover more edge cases.
