# Local Setup Guide

## Prerequisites
- Node.js 20+ installed
- PostgreSQL installed locally OR use a free cloud database (like [Supabase](https://supabase.com) or [Neon](https://neon.tech))

## Quick Setup

### Option 1: Local PostgreSQL

1. **Install PostgreSQL** (if not installed):
   - Mac: `brew install postgresql@16`
   - Or download from: https://www.postgresql.org/download/

2. **Create database:**
   ```bash
   createdb medico
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   ```
   DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/medico?schema=public"
   JWT_SECRET="your-secret-key-here-change-this"
   PORT=8080
   NODE_ENV=development
   ```

5. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed data:**
   ```bash
   npm run seed
   ```

7. **Start server:**
   ```bash
   npm run dev
   ```

8. **Test:**
   ```bash
   curl http://localhost:8080/health
   ```

### Option 2: Cloud PostgreSQL (Easier - No local DB needed)

1. **Get free PostgreSQL:**
   - Go to: https://neon.tech (free tier)
   - Create account → Create project
   - Copy the connection string

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   DATABASE_URL="postgresql://user:pass@host.neon.tech/medico?sslmode=require"
   JWT_SECRET="your-secret-key-change-this"
   PORT=8080
   NODE_ENV=development
   ```

4. **Run migrations:**
   ```bash
   npm run prisma:migrate
   ```

5. **Seed data:**
   ```bash
   npm run seed
   ```

6. **Start server:**
   ```bash
   npm run dev
   ```

## Postman Setup

1. Import `postman/Medico.postman_collection.json`
2. Import `postman/Medico.postman_environment.json`
3. Select "Medico Environment"
4. Set `baseUrl` = `http://localhost:8080`
5. Start testing!

## Troubleshooting

- **Port 8080 already in use?** Change `PORT` in `.env`
- **Database connection error?** Check `DATABASE_URL` in `.env`
- **Prisma errors?** Run `npx prisma generate`

