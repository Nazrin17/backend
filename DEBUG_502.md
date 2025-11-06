# 🔍 502 Hatası Debug Rehberi

## Adım 1: Health Endpoint Test Et

Önce `/health` endpoint'ini test et:

```bash
curl https://your-api-url.onrender.com/health
```

### Eğer `/health` çalışıyorsa:
- Migration'lar tamamlanmış ✅
- Database bağlantısı var ✅
- Sorun `/admin/doctors` route'unda ❌

### Eğer `/health` de 502 veriyorsa:
- Migration'lar çalışmamış ❌
- Start command'ı kontrol et
- Deploy'u beklemek gerekebilir

## Adım 2: Admin Route Kontrolü

Eğer `/health` çalışıyorsa, admin route'unu test et:

```bash
# GET request (listeleme)
curl https://your-api-url.onrender.com/admin/doctors

# POST request (doktor ekleme)
curl -X POST https://your-api-url.onrender.com/admin/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Doctor",
    "specialization": "Test",
    "categoryId": "CATEGORY_ID_BURAYA"
  }'
```

## Adım 3: Render Logs Kontrolü

1. Render Dashboard → `medico-backend` → **"Logs"** sekmesi
2. Son hataları kontrol et
3. Özellikle şu hataları ara:
   - "Cannot find module"
   - "Route" hataları
   - "Prisma" hataları

## Adım 4: Route Sırası Sorunu

Eğer `/doctors/:id` route'u `/admin/doctors`'tan önce tanımlanmışsa, `/admin/doctors` yerine `/doctors/admin` olarak algılanabilir.

**Çözüm:** Route sırasını kontrol et - `/admin/doctors` `/doctors`'tan ÖNCE olmalı.

