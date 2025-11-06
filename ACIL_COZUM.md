# 🚨 502 Bad Gateway - Acil Çözüm

502 hatası alıyorsun çünkü database migration'ları çalışmamış. Şu adımları TAM OLARAK takip et:

## ⚡ Hızlı Çözüm (5 dakika)

### Adım 1: Render Shell'e Git

1. Render Dashboard → `medico-backend` service
2. **"Shell"** sekmesine tıkla

### Adım 2: Migration Çalıştır

Shell'de şu komutu çalıştır:

```bash
npm run prisma:deploy
```

**Başarılı olursa şunu göreceksin:**
```
✅ Applied migration: 0_init
```

### Adım 3: Seed Data Ekle (Opsiyonel)

```bash
npm run seed
```

### Adım 4: Service'i Restart Et

1. Render Dashboard'a dön
2. **"Manual Deploy"** → **"Restart"** tıkla
3. Veya **"Events"** sekmesinden **"Restart"** butonuna tıkla

## 🔍 Sorun Devam Ederse

### Kontrol 1: Start Command Doğru mu?

Settings → Start Command şu şekilde olmalı:
```
npm run prisma:deploy && npm start
```

### Kontrol 2: Database Bağlantısı

Shell'den test et:
```bash
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.\$queryRaw\`SELECT NOW()\`.then(r=>{console.log('✅ DB OK:',r);p.\$disconnect();}).catch(e=>{console.error('❌ DB ERROR:',e.message);process.exit(1);});"
```

### Kontrol 3: Prisma Client Generate

```bash
npx prisma generate
```

### Kontrol 4: Logs'u Kontrol Et

Render Dashboard → **"Logs"** sekmesi → Son hataları kontrol et

## 📋 Adım Adım Checklist

- [ ] Shell'e girdim
- [ ] `npm run prisma:deploy` çalıştırdım
- [ ] Migration başarılı oldu
- [ ] Service'i restart ettim
- [ ] `/health` endpoint'ini test ettim
- [ ] Hala 502 alıyorsam logs'u kontrol ettim

## 🆘 Hala Çalışmıyorsa

Logs'dan tam hata mesajını kopyala ve paylaş. Özellikle şunları ara:
- "Migration" hataları
- "Database" bağlantı hataları
- "Prisma" hataları

