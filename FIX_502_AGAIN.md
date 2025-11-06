# 🔧 502 Bad Gateway - Hızlı Çözüm

502 hatası alıyorsun. Şu adımları takip et:

## Adım 1: Render Shell'den Kontrol Et

1. **Render Dashboard → `medico-backend` → "Shell"**

2. **Migration durumunu kontrol et:**
   ```bash
   npm run prisma:deploy
   ```

3. **Eğer migration hatası varsa, Prisma client'ı yeniden generate et:**
   ```bash
   npx prisma generate
   ```

4. **Seed data ekle (eğer yoksa):**
   ```bash
   npm run seed
   ```

## Adım 2: Server Loglarını Kontrol Et

1. **Render Dashboard → `medico-backend` → "Logs" sekmesi**
2. **Son hataları kontrol et**
3. **Özellikle şu hatalara bak:**
   - Database connection errors
   - Prisma errors
   - Migration errors

## Adım 3: Service'i Restart Et

1. **"Manual Deploy" → "Clear build cache & deploy"**
2. **Veya "Restart" butonuna tıkla**

## Adım 4: Start Command Kontrolü

Settings → Start Command şu şekilde olmalı:
```
npm run prisma:deploy && npm start
```

## Hızlı Test Script

Shell'den çalıştır:
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$queryRaw\`SELECT NOW()\`.then(r => {
  console.log('Database OK:', r);
  prisma.\$disconnect();
}).catch(e => {
  console.error('Database ERROR:', e.message);
  process.exit(1);
});
"
```

## Olası Sorunlar ve Çözümler

### Sorun 1: Migration'lar çalışmamış
**Çözüm:** Shell'den `npm run prisma:deploy` çalıştır

### Sorun 2: Prisma client eski
**Çözüm:** `npx prisma generate` çalıştır

### Sorun 3: Database bağlantısı yok
**Çözüm:** Settings → Environment Variables → `DATABASE_URL` kontrol et

### Sorun 4: Server başlamıyor
**Çözüm:** Logs'u kontrol et, hata mesajını paylaş

