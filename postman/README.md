# Postman Collection for Medico API

## Import Instructions

1. **Import Collection**: Import `Medico.postman_collection.json` into Postman
2. **Import Environment**: Import `Medico.postman_environment.json` into Postman
3. **Select Environment**: Select "Medico Environment" from the environment dropdown

## Setup

1. Update `baseUrl` in the environment:
   - Local: `http://localhost:8080`
   - Production: Your deployed URL (e.g., `https://your-api.onrender.com`)

## Usage Flow

1. **Register or Login**: Run "Auth > Register" or "Auth > Login"
   - The token and userId will be automatically saved to environment variables
   
2. **Browse Categories**: Run "Catalog > Get Categories"

3. **Get Doctors**: Run "Catalog > Get Doctors" (optionally with filters)

4. **View Doctor Details**: 
   - First get a doctorId from "Get Doctors" response
   - Set `doctorId` in environment or use directly
   - Run "Doctors > Get Doctor Details"

5. **View Reviews**: Run "Doctors > Get Doctor Reviews"

6. **Create Review**: Run "Doctors > Create Review" (requires userId from login)

7. **Book Appointment**: Run "Appointments > Book Appointment" (requires userId and doctorId)

8. **View Appointments**: Run "Appointments > Get User Appointments"

## Environment Variables

- `baseUrl`: API base URL
- `token`: JWT token (auto-set after login/register)
- `userId`: Current user ID (auto-set after login/register)
- `doctorId`: Doctor ID (set manually from API responses)
- `categoryId`: Category ID (set manually from API responses)

## Notes

- Auth endpoints automatically save token and userId to environment
- Some endpoints require authentication (Bearer token) - enable the Authorization header in those requests
- Date format for appointments: ISO 8601 (e.g., `2025-01-16T10:00:00.000Z`)

