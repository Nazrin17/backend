# Local Postman Test Rehberi

## Adım 1: Node.js Kurulumu

Mac'te Node.js kurmak için:

```bash
# Homebrew ile (önerilen)
brew install node

# Veya resmi sitesinden indir:
# https://nodejs.org/
```

Kurulumdan sonra kontrol et:
```bash
node --version  # v20.x.x olmalı
npm --version   # 10.x.x olmalı
```

## Adım 2: PostgreSQL Kurulumu

### Seçenek A: Local PostgreSQL (Mac)
```bash
brew install postgresql@16
brew services start postgresql@16
createdb medico
```

### Seçenek B: Cloud Database (Daha Kolay - Önerilen)
1. https://neon.tech adresine git
2. Ücretsiz hesap oluştur
3. Yeni proje oluştur
4. Connection string'i kopyala (şöyle görünür: `postgresql://user:pass@host.neon.tech/dbname`)

## Adım 3: Backend Kurulumu

```bash
cd /tmp/medico-backend

# Dependencies kur
npm install

# .env dosyası oluştur
cp .env.example .env
```

`.env` dosyasını düzenle:
- Local PostgreSQL için:
  ```
  DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/medico?schema=public"
  ```
- Cloud PostgreSQL için (Neon'dan kopyaladığın string):
  ```
  DATABASE_URL="postgresql://user:pass@host.neon.tech/dbname?sslmode=require"
  ```

Diğer ayarlar:
```
JWT_SECRET="my-secret-key-change-this-123"
PORT=8080
NODE_ENV=development
```

## Adım 4: Database Setup

```bash
# Migration çalıştır
npm run prisma:migrate

# Seed data ekle (örnek doktorlar ve kategoriler)
npm run seed
```

## Adım 5: Server'ı Başlat

```bash
npm run dev
```

Server çalışıyor olmalı: `http://localhost:8080`

## Adım 6: Postman'de Test Et

1. **Postman'i aç**
2. **Collection import et:**
   - File → Import
   - `/tmp/medico-backend/postman/Medico.postman_collection.json` dosyasını seç

3. **Environment import et:**
   - File → Import
   - `/tmp/medico-backend/postman/Medico.postman_environment.json` dosyasını seç

4. **Environment seç:**
   - Sağ üstte "Medico Environment" seçili olduğundan emin ol
   - `baseUrl` = `http://localhost:8080` olmalı

5. **Test et:**
   - Önce "Health > Health Check" endpoint'ini test et
   - Sonra "Auth > Register" veya "Auth > Login" yap
   - Token otomatik kaydedilecek
   - Diğer endpoint'leri test et!

## Hızlı Test (Terminal'den)

```bash
# Health check
curl http://localhost:8080/health

# Register
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Sorun Giderme

- **Port 8080 kullanımda?** `.env` dosyasında `PORT=3000` yap
- **Database bağlantı hatası?** `DATABASE_URL`'i kontrol et
- **Prisma hatası?** `npx prisma generate` çalıştır

