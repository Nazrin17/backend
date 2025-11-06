# 🚀 HIZLI DEPLOY REHBERİ

Backend'i publish etmek için 2 seçenek var:

## ⭐ Seçenek 1: Render Blueprint (EN KOLAY - 2 DAKİKA)

1. **PR'ı Merge Et:**
   - https://github.com/Nazrin17/backend/pull/1
   - "Merge pull request" tıkla

2. **Render'a Git:**
   - https://dashboard.render.com
   - GitHub ile giriş yap (ücretsiz)

3. **Blueprint Deploy:**
   - "New +" → "Blueprint"
   - `Nazrin17/backend` repo'sunu seç
   - "Apply" tıkla
   - 5-10 dakika bekle

4. **Hazır!** 🎉
   - API URL: `https://medico-backend-XXXX.onrender.com`
   - Bu URL'i Postman'de kullan

## Seçenek 2: Manuel Deploy

Detaylar için: `DEPLOY_NOW.md` dosyasına bak

## Postman'de Test Et

1. Postman'i aç
2. Environment: "Medico Environment"
3. `baseUrl` = Render URL'in (örn: `https://medico-backend-XXXX.onrender.com`)
4. Test et!

## Önemli Notlar

- Render ücretsiz plan kullanıyor (ilk deploy biraz yavaş olabilir)
- Database otomatik oluşturulacak
- Seed data için Render Shell'den: `npm run seed`

