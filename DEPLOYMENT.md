# Deployment Guide

## Quick Deploy to Render (Free)

### Option 1: One-Click Deploy (Recommended)

1. **Fork/Clone this repo** to your GitHub account
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **"New +"** → **"Blueprint"**
4. Connect your GitHub account and select this repository
5. Render will detect `render.yaml` and deploy automatically
6. Wait for deployment (5-10 minutes)
7. Your API will be live at: `https://medico-backend.onrender.com` (or similar)

### Option 2: Manual Deploy

1. **Create PostgreSQL Database:**
   - Go to Render Dashboard → **"New +"** → **"PostgreSQL"**
   - Name: `medico-db`
   - Plan: Free
   - Copy the **Internal Database URL**

2. **Create Web Service:**
   - Go to **"New +"** → **"Web Service"**
   - Connect your GitHub repo
   - Settings:
     - **Name:** `medico-backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install && npx prisma generate && npm run build`
     - **Start Command:** `npm run prisma:deploy && npm start`
     - **Plan:** Free

3. **Environment Variables:**
   - `NODE_ENV` = `production`
   - `PORT` = `8080`
   - `JWT_SECRET` = (generate a random string, e.g., `openssl rand -hex 32`)
   - `DATABASE_URL` = (paste the PostgreSQL connection string from step 1)

4. **Deploy:**
   - Click **"Create Web Service"**
   - Wait for build and deployment

5. **Seed Database (First Time):**
   - After deployment, go to **"Shell"** tab in Render dashboard
   - Run: `npm run seed`

### Update Postman Environment

After deployment, update your Postman environment:
- `baseUrl` = `https://your-app-name.onrender.com` (your Render URL)

## Alternative: Railway Deployment

1. Go to [Railway](https://railway.app)
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Select this repository
4. Railway will auto-detect Node.js
5. Add **PostgreSQL** service
6. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway)
   - `JWT_SECRET` (generate random string)
   - `PORT` = `8080`
7. Deploy!

## Local Testing

```bash
# Start with Docker
docker compose up -d

# Run migrations
docker compose exec api npx prisma migrate deploy

# Seed data
docker compose exec api npm run seed

# API available at http://localhost:8080
```

## Health Check

After deployment, test:
```bash
curl https://your-app.onrender.com/health
```

Expected response:
```json
{"status":"ok","now":"2025-11-06T..."}
```

