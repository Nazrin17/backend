# 🔧 Shell Olmadan Migration Çalıştırma

Render Shell'e erişimin yok (free plan). Alternatif çözümler:

## ✅ Çözüm 1: Start Command Düzeltildi (Otomatik)

`render.yaml` ve `package.json` güncellendi. Artık her deploy'da migration'lar otomatik çalışacak.

**Yapman gereken:**
1. Render Dashboard → `medico-backend` → Settings
2. **Start Command** kontrol et: `npm run start:migrate` olmalı
3. Değilse, manuel olarak şunu yapıştır: `npm run start:migrate`
4. **Save Changes**
5. **Manual Deploy** → **"Clear build cache & deploy"**

## ✅ Çözüm 2: Migration Endpoint Ekle (API'den)

Migration'ı API endpoint'inden çalıştırabiliriz. İstersen ekleyebilirim.

## ✅ Çözüm 3: Build Command'a Ekle

Build sırasında migration çalıştırabiliriz ama bu daha yavaş olur.

## 🎯 Şimdi Ne Yapmalısın?

1. **Settings → Start Command'ı kontrol et**
2. **`npm run start:migrate` olduğundan emin ol**
3. **Deploy et**

Deploy sonrası migration'lar otomatik çalışacak ve 502 hatası düzelecek!

