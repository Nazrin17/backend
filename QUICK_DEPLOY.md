# Quick Deploy Instructions

## 🚀 Deploy to Render (5 minutes)

### Step 1: Merge PR
First, merge the PR on GitHub to get code on `main` branch:
- Go to: https://github.com/Nazrin17/backend/pull/1
- Click "Merge pull request"

### Step 2: Deploy on Render

**Option A: One-Click Deploy (Easiest)**
1. Go to: https://dashboard.render.com
2. Sign up/login (free)
3. Click **"New +"** → **"Blueprint"**
4. Connect GitHub → Select `Nazrin17/backend` repository
5. Render will auto-detect `render.yaml`
6. Click **"Apply"** → Wait 5-10 minutes
7. Your API URL will be: `https://medico-backend-XXXX.onrender.com`

**Option B: Manual Setup**
1. Go to: https://dashboard.render.com
2. **New PostgreSQL:**
   - Name: `medico-db`
   - Plan: Free
   - Copy the **Internal Database URL**
3. **New Web Service:**
   - Connect repo: `Nazrin17/backend`
   - Name: `medico-backend`
   - Environment: `Node`
   - Build: `npm install && npx prisma generate && npm run build`
   - Start: `npm run prisma:deploy && npm start`
   - Add Environment Variable:
     - `DATABASE_URL` = (from PostgreSQL step)
     - `JWT_SECRET` = (generate: `openssl rand -hex 32`)
     - `PORT` = `8080`
4. Deploy!

### Step 3: Seed Database
After deployment:
1. Go to Render dashboard → Your service → **"Shell"** tab
2. Run: `npm run seed`

### Step 4: Update Postman
1. Open Postman
2. Select "Medico Environment"
3. Update `baseUrl` to your Render URL (e.g., `https://medico-backend-XXXX.onrender.com`)
4. Test `/health` endpoint first!

## ✅ Test Your Deployment

```bash
# Health check
curl https://your-app.onrender.com/health

# Register
curl -X POST https://your-app.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 📝 Your API URL
After deployment, your API will be live at:
- `https://medico-backend-XXXX.onrender.com` (or similar)

Update Postman `baseUrl` with this URL!

