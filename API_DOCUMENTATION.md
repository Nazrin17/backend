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
6. [Admin](#admin)

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

Book an appointment with a doctor.

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
- `400` - Validation error

**Validation Rules:**
- `userId`: Required, valid user ID
- `date`: Required, ISO 8601 date string
- `notes`: Optional
- `gender`: Optional
- `birthDate`: Optional, ISO 8601 date string

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
  "categoryId": "clx1234567890"
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
}
```

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

