# Medico Backend

Node.js + Express + TypeScript backend for login/register, categories, doctors, reviews, and appointment booking, aligned to the shared Figma screens.

## Quickstart (Docker)

```bash
cp .env.example .env
docker compose up -d --build
# In another shell (only first time):
docker compose exec api npx prisma migrate deploy
docker compose exec api npm run seed
```

## Local Dev

```bash
npm install
npx prisma generate
npm run dev
```

## API Endpoints

- POST `/auth/register`
- POST `/auth/login`
- GET `/catalog/categories`
- GET `/catalog/doctors?categoryId=...&q=...`
- GET `/doctors/:id`
- GET `/doctors/:id/reviews`
- POST `/doctors/:id/reviews` { rating, comment, userId }
- POST `/appointments/:doctorId/book` { userId, date, notes?, gender?, birthDate? }
- GET `/appointments/user/:userId`

## Database

- PostgreSQL with Prisma models: User, Category, Doctor, Review, Appointment.

## Deployment

- Dockerfile included. Can be deployed to Render, Railway, or any container platform.

## Postman

- A Postman collection will be added in a follow-up commit after deploy URL is available.
