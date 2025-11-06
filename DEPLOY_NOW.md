# 🚀 Tek Tıkla Deploy - Render

## Adım 1: GitHub'da PR'ı Merge Et
1. https://github.com/Nazrin17/backend/pull/1 adresine git
2. "Merge pull request" butonuna tıkla
3. Main branch'e merge olmasını bekle

## Adım 2: Render'a Deploy Et (2 dakika)

### Yöntem 1: Blueprint ile (En Kolay - Önerilen) ⭐

1. **Render'a Git:**
   - https://dashboard.render.com adresine git
   - Ücretsiz hesap oluştur (GitHub ile giriş yapabilirsin)

2. **Blueprint Deploy:**
   - "New +" butonuna tıkla
   - "Blueprint" seçeneğini seç
   - GitHub hesabını bağla
   - `Nazrin17/backend` repository'sini seç
   - Render otomatik olarak `render.yaml` dosyasını bulacak
   - "Apply" butonuna tıkla
   - 5-10 dakika bekle

3. **Hazır!** 🎉
   - API URL'in: `https://medico-backend-XXXX.onrender.com`
   - Bu URL'i Postman'de `baseUrl` olarak kullan

### Yöntem 2: Manuel Deploy

1. **PostgreSQL Oluştur:**
   - Render Dashboard → "New +" → "PostgreSQL"
   - Name: `medico-db`
   - Plan: Free
   - "Create Database" tıkla
   - "Internal Database URL"i kopyala

2. **Web Service Oluştur:**
   - "New +" → "Web Service"
   - GitHub repo'yu bağla: `Nazrin17/backend`
   - Settings:
     - Name: `medico-backend`
     - Environment: `Node`
     - Build Command: `npm install && npx prisma generate && npm run build`
     - Start Command: `npm run prisma:deploy && npm start`
     - Plan: Free

3. **Environment Variables:**
   - `DATABASE_URL` = (PostgreSQL'den kopyaladığın URL)
   - `JWT_SECRET` = (rastgele string, örn: `openssl rand -hex 32`)
   - `PORT` = `8080`
   - `NODE_ENV` = `production`

4. **Deploy:**
   - "Create Web Service" tıkla
   - Build tamamlanmasını bekle

5. **Database Seed:**
   - Service → "Shell" tab
   - Çalıştır: `npm run seed`

## Adım 3: Postman'de Test Et

1. Postman'i aç
2. Environment'ı seç: "Medico Environment"
3. `baseUrl`'i değiştir: Render'dan aldığın URL (örn: `https://medico-backend-XXXX.onrender.com`)
4. Test et! 🚀

## ✅ Test Endpoint

```bash
curl https://your-app.onrender.com/health
```

Başarılı olursa:
```json
{"status":"ok","now":"2025-11-06T..."}
```

## Sorun mu var?

- Build hatası? → Render logs'u kontrol et
- Database hatası? → `DATABASE_URL`'i kontrol et
- 404 hatası? → `/health` endpoint'ini test et

