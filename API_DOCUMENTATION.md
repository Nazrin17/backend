# Medico API Documentation

Complete API documentation for Medico Backend - Medical Services Platform

**Base URL:** `https://your-api-url.onrender.com`

---

## Table of Contents

1. [Health Check](#health-check)
2. [Authentication](#authentication)
3. [Catalog](#catalog)
4. [Doctors](#doctors)
5. [Appointments](#appointments)
6. [Availability](#availability)
7. [Admin](#admin)

---

## Health Check

### GET /health

Check API health and database connection.

**Response:**
```json
{
  "status": "ok",
  "now": "2025-11-06T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `500` - Database connection error

---

## Authentication

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "James Schleifer",
  "email": "jamesschleifer@gmail.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx1234567890",
    "name": "James Schleifer",
    "email": "jamesschleifer@gmail.com"
  }
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Validation error
- `409` - Email already registered

**Validation Rules:**
- `name`: Required, minimum 1 character
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

---

### POST /auth/login

Login with email and password.

**Request Body:**
```json
{
  "email": "jamesschleifer@gmail.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx1234567890",
    "name": "James Schleifer",
    "email": "jamesschleifer@gmail.com"
  }
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Validation error
- `401` - Invalid credentials

**Note:** Token expires in 7 days. Use it in `Authorization: Bearer {token}` header for protected endpoints.

---

## Catalog

### GET /catalog/categories

Get all medical service categories.

**Response (200):**
```json
{
  "data": [
    {
      "id": "clx1234567890",
      "name": "Neurology",
      "icon": "brain",
      "createdAt": "2025-11-06T12:00:00.000Z"
    },
    {
      "id": "clx1234567891",
      "name": "Cardiology",
      "icon": "heart",
      "createdAt": "2025-11-06T12:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success

---

### GET /catalog/doctors

Get list of doctors with optional filtering and search.

**Query Parameters:**
- `categoryId` (optional) - Filter by category ID
- `q` (optional) - Search query (searches in doctor name and specialization)

**Examples:**
```
GET /catalog/doctors
GET /catalog/doctors?categoryId=clx1234567890
GET /catalog/doctors?q=psychiatrist
GET /catalog/doctors?categoryId=clx1234567890&q=neurologist
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "clx1234567890",
      "name": "Dr. Hannibal Lector",
      "specialization": "Psychiatrist",
      "photoUrl": null,
      "experienceYrs": 10,
      "patientsCount": 7500,
      "feeCents": 6499,
      "ratingAverage": 4.5,
      "ratingCount": 87,
      "distanceM": 500,
      "categoryId": "clx1234567891"
    }
  ]
}
```

**Status Codes:**
- `200` - Success

**Note:** Results are sorted by rating (highest first).

---

## Doctors

### GET /doctors/:id

Get detailed information about a specific doctor.

**Path Parameters:**
- `id` - Doctor ID

**Response (200):**
```json
{
  "data": {
    "id": "clx1234567890",
    "name": "Dr. Hannibal Lector",
    "specialization": "Psychiatrist",
    "photoUrl": null,
    "experienceYrs": 10,
    "patientsCount": 7500,
    "feeCents": 6499,
    "ratingAverage": 4.5,
    "ratingCount": 87,
    "distanceM": 500,
    "categoryId": "clx1234567891",
    "availableSlots": "[\"09:00\",\"10:00\",\"11:00\",\"14:00\",\"15:00\"]",
    "category": {
      "id": "clx1234567891",
      "name": "Neurology",
      "icon": "brain"
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Doctor not found

**Note:** `availableSlots` is a JSON string array of time slots (e.g., `["09:00", "10:00", "11:00"]`). If null, doctor accepts appointments at any time.

---

### GET /doctors/:id/reviews

Get all reviews for a specific doctor.

**Path Parameters:**
- `id` - Doctor ID

**Response (200):**
```json
{
  "data": [
    {
      "id": "clx1234567890",
      "rating": 5,
      "comment": "Excellent care. Dr. Lector provided exceptional service.",
      "createdAt": "2025-11-06T12:00:00.000Z",
      "userId": "clx1234567891",
      "doctorId": "clx1234567892",
      "user": {
        "id": "clx1234567891",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

**Status Codes:**
- `200` - Success

**Note:** Results are sorted by creation date (newest first).

---

### POST /doctors/:id/reviews

Create a new review for a doctor.

**Path Parameters:**
- `id` - Doctor ID

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Dr. Lector provided exceptional care, addressing my concerns with expertise and empathy.",
  "userId": "clx1234567890"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "clx1234567890",
    "rating": 5,
    "comment": "Dr. Lector provided exceptional care...",
    "createdAt": "2025-11-06T12:00:00.000Z",
    "userId": "clx1234567891",
    "doctorId": "clx1234567892"
  }
}
```

**Status Codes:**
- `201` - Review created successfully
- `400` - Validation error

**Validation Rules:**
- `rating`: Required, integer between 1 and 5
- `comment`: Required, minimum 1 character
- `userId`: Required, valid user ID

---

## Appointments

### POST /appointments/:doctorId/book

Book an appointment with a doctor. The system automatically checks:
1. If the doctor has defined available time slots, the requested time must be in that list
2. If the time slot is already booked by another user (prevents double booking)

**Path Parameters:**
- `doctorId` - Doctor ID

**Request Body:**
```json
{
  "userId": "clx1234567890",
  "date": "2025-01-16T10:00:00.000Z",
  "notes": "My tummy hurts for no reason :(",
  "gender": "Female",
  "birthDate": "1995-05-12"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "clx1234567890",
    "date": "2025-01-16T10:00:00.000Z",
    "notes": "My tummy hurts for no reason :(",
    "gender": "Female",
    "birthDate": "1995-05-12T00:00:00.000Z",
    "userId": "clx1234567891",
    "doctorId": "clx1234567892",
    "status": "booked",
    "createdAt": "2025-11-06T12:00:00.000Z"
  }
}
```

**Status Codes:**
- `201` - Appointment booked successfully
- `400` - Validation error or time slot not available
- `404` - Doctor not found
- `409` - Time slot already booked (double booking prevented)
- `500` - Server error

**Validation Rules:**
- `userId`: Required, valid user ID
- `date`: Required, ISO 8601 date string (must include time, e.g., `2025-01-16T10:00:00.000Z`)
- `notes`: Optional
- `gender`: Optional
- `birthDate`: Optional, ISO 8601 date string

**Error Responses:**

**400 - Time slot not available:**
```json
{
  "error": "Time slot not available",
  "availableSlots": ["09:00", "10:00", "11:00", "14:00", "15:00"],
  "requestedTime": "16:00"
}
```

**409 - Time slot already booked:**
```json
{
  "error": "This time slot is already booked",
  "bookedTime": "10:00",
  "date": "2025-01-16",
  "existingAppointmentId": "clx1234567890"
}
```

**Note:** 
- If doctor has `availableSlots` defined, only those time slots can be booked
- If `availableSlots` is null, any time can be booked (subject to double booking check)
- The system prevents double booking by checking if another appointment exists at the same date and time

---

### GET /appointments/user/:userId

Get all appointments for a specific user.

**Path Parameters:**
- `userId` - User ID

**Response (200):**
```json
{
  "data": [
    {
      "id": "clx1234567890",
      "date": "2025-01-16T10:00:00.000Z",
      "notes": "My tummy hurts for no reason :(",
      "gender": "Female",
      "birthDate": "1995-05-12T00:00:00.000Z",
      "userId": "clx1234567891",
      "doctorId": "clx1234567892",
      "status": "booked",
      "createdAt": "2025-11-06T12:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success

**Note:** Results are sorted by date (newest first).

---

## Availability

### GET /availability/:doctorId/availability

Get available time slots for a doctor on a specific date. Shows which slots are available, booked, and free.

**Path Parameters:**
- `doctorId` - Doctor ID

**Query Parameters:**
- `date` (required) - Date in YYYY-MM-DD format

**Example:**
```
GET /availability/clx1234567890/availability?date=2025-01-16
```

**Response (200):**
```json
{
  "doctorId": "clx1234567890",
  "date": "2025-01-16",
  "availableSlots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  "bookedSlots": ["10:00"],
  "freeSlots": ["09:00", "11:00", "14:00", "15:00", "16:00"],
  "totalAvailable": 6,
  "totalBooked": 1,
  "totalFree": 5
}
```

**Status Codes:**
- `200` - Success
- `400` - Date parameter missing or invalid
- `404` - Doctor not found
- `500` - Server error

**Notes:**
- `availableSlots`: All time slots the doctor has defined (if none defined, returns all 24 hours)
- `bookedSlots`: Time slots already booked by other users
- `freeSlots`: Available slots that are not yet booked
- Use this endpoint before booking to see available times

---

## Admin

### Categories

#### POST /admin/categories

Create a new category.

**Request Body:**
```json
{
  "name": "Dermatology",
  "icon": "skin"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "clx1234567890",
    "name": "Dermatology",
    "icon": "skin",
    "createdAt": "2025-11-06T12:00:00.000Z"
  }
}
```

**Status Codes:**
- `201` - Category created successfully
- `400` - Validation error
- `500` - Server error

---

#### GET /admin/categories

Get all categories (admin view).

**Response (200):**
```json
{
  "data": [
    {
      "id": "clx1234567890",
      "name": "Neurology",
      "icon": "brain",
      "createdAt": "2025-11-06T12:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success

---

#### DELETE /admin/categories

Delete all categories.

**Response (200):**
```json
{
  "message": "All categories deleted successfully",
  "deletedCount": 6
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

**Warning:** This will delete all categories. Use with caution!

---

#### DELETE /admin/categories/:id

Delete a specific category by ID.

**Path Parameters:**
- `id` - Category ID

**Response (200):**
```json
{
  "message": "Category deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `404` - Category not found
- `500` - Server error

**Warning:** Deleting a category may affect related doctors.

---

### Doctors

#### POST /admin/doctors

Create a new doctor.

**Request Body:**
```json
{
  "name": "Dr. Yeni Doktor",
  "specialization": "Neurologist",
  "photoUrl": "https://example.com/photo.jpg",
  "experienceYrs": 5,
  "patientsCount": 1000,
  "feeCents": 5000,
  "ratingAverage": 4.5,
  "ratingCount": 50,
  "distanceM": 1000,
  "categoryId": "clx1234567890",
  "availableSlots": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
}
```

**Response (201):**
```json
{
  "data": {
    "id": "clx1234567890",
    "name": "Dr. Yeni Doktor",
    "specialization": "Neurologist",
    "photoUrl": "https://example.com/photo.jpg",
    "experienceYrs": 5,
    "patientsCount": 1000,
    "feeCents": 5000,
    "ratingAverage": 4.5,
    "ratingCount": 50,
    "distanceM": 1000,
    "categoryId": "clx1234567891",
    "availableSlots": "[\"09:00\",\"10:00\",\"11:00\",\"14:00\",\"15:00\",\"16:00\"]",
    "category": {
      "id": "clx1234567891",
      "name": "Neurology",
      "icon": "brain"
    }
  }
}
```

**Status Codes:**
- `201` - Doctor created successfully
- `400` - Validation error
- `500` - Server error

**Validation Rules:**
- `name`: Required, minimum 1 character
- `specialization`: Required, minimum 1 character
- `photoUrl`: Optional
- `experienceYrs`: Optional, integer, default 0
- `patientsCount`: Optional, integer, default 0
- `feeCents`: Optional, integer (fee in cents), default 0
- `ratingAverage`: Optional, float between 0-5, default 0
- `ratingCount`: Optional, integer, default 0
- `distanceM`: Optional, integer (distance in meters)
- `categoryId`: Required, valid category ID
- `availableSlots`: Optional, array of time slots in "HH:MM" format (e.g., `["09:00", "10:00", "11:00"]`)

**Available Slots Examples:**
- Morning only: `["09:00", "10:00", "11:00"]`
- Afternoon only: `["14:00", "15:00", "16:00", "17:00"]`
- Full day: `["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]`
- If not provided, doctor accepts appointments at any time (subject to double booking check)

---

#### GET /admin/doctors

Get all doctors (admin view).

**Response (200):**
```json
{
  "data": [
    {
      "id": "clx1234567890",
      "name": "Dr. Hannibal Lector",
      "specialization": "Psychiatrist",
      "photoUrl": null,
      "experienceYrs": 10,
      "patientsCount": 7500,
      "feeCents": 6499,
      "ratingAverage": 4.5,
      "ratingCount": 87,
      "distanceM": 500,
      "categoryId": "clx1234567891",
      "category": {
        "id": "clx1234567891",
        "name": "Neurology",
        "icon": "brain"
      }
    }
  ]
}
```

**Status Codes:**
- `200` - Success

---

#### DELETE /admin/doctors

Delete all doctors.

**Response (200):**
```json
{
  "message": "All doctors deleted successfully",
  "deletedCount": 3
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

**Warning:** This will delete all doctors. Use with caution!

---

#### DELETE /admin/doctors/:id

Delete a specific doctor by ID.

**Path Parameters:**
- `id` - Doctor ID

**Response (200):**
```json
{
  "message": "Doctor deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `404` - Doctor not found
- `500` - Server error

**Warning:** Deleting a doctor may affect related reviews and appointments.

---

### Seed Data

#### POST /admin/seed

Seed initial data (categories, doctors, users, reviews).

**Response (200):**
```json
{
  "message": "Seed data created successfully",
  "categories": 6,
  "user": "demo@example.com"
}
```

**Status Codes:**
- `200` - Seed data created successfully
- `500` - Server error

**What it creates:**
- Demo user: `demo@example.com` / `password123`
- Categories: Doctor, Pharmacy, Hospital, Ambulance, Neurology, Cardiology
- Sample doctors with reviews

**Note:** Uses `skipDuplicates: true`, so safe to run multiple times.

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "fieldErrors": {
    "email": ["Invalid email format"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "Doctor not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already registered"
}
```

**Or for appointments:**
```json
{
  "error": "This time slot is already booked",
  "bookedTime": "10:00",
  "date": "2025-01-16",
  "existingAppointmentId": "clx1234567890"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create doctor"
}
```

---

## Authentication

Most endpoints don't require authentication. However, for production use, consider adding JWT authentication middleware to protected endpoints.

**Token Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Expiration:** 7 days

---

## Rate Limiting

Currently, there are no rate limits implemented. For production, consider adding rate limiting middleware.

---

## Data Models

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category
```typescript
{
  id: string;
  name: string;
  icon?: string;
  createdAt: Date;
}
```

### Doctor
```typescript
{
  id: string;
  name: string;
  specialization: string;
  photoUrl?: string;
  experienceYrs: number;
  patientsCount: number;
  feeCents: number;
  ratingAverage: number;
  ratingCount: number;
  distanceM?: number;
  categoryId: string;
  availableSlots?: string; // JSON string array, e.g., "[\"09:00\",\"10:00\",\"11:00\"]"
}
```

**Note:** `availableSlots` is stored as a JSON string. When creating a doctor, send it as an array. When reading, it's returned as a JSON string that needs to be parsed.

### Review
```typescript
{
  id: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  userId: string;
  doctorId: string;
}
```

### Appointment
```typescript
{
  id: string;
  date: Date;
  notes?: string;
  gender?: string;
  birthDate?: Date;
  userId: string;
  doctorId: string;
  status: string; // default: "booked"
  createdAt: Date;
}
```

---

## Postman Collection

A complete Postman collection is available at:
- `postman/Medico.postman_collection.json`
- `postman/Medico.postman_environment.json`

Import both files into Postman for easy testing.

---

## Support

For issues or questions, please check:
- GitHub Repository: https://github.com/Nazrin17/backend
- API Health: `GET /health`

---

**Last Updated:** November 6, 2025

