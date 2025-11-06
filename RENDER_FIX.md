# 🔧 Render Build Command Manuel Güncelleme

Render hala eski build command'ı kullanıyor. Şu adımları takip et:

## Render Dashboard'da Build Command Güncelle

1. **Render Dashboard'a git:**
   - https://dashboard.render.com
   - `medico-backend` service'ini aç

2. **Settings'e git:**
   - Sol menüden "Settings" sekmesine tıkla

3. **Build Command'ı güncelle:**
   - "Build Command" alanını bul
   - Şu komutu yapıştır:
   ```
   npm install && npx prisma generate && npm run build
   ```
   - "Save Changes" tıkla

4. **Manual Deploy:**
   - "Manual Deploy" → "Clear build cache & deploy" seçeneğini kullan
   - Veya "Events" sekmesinden "Deploy latest commit" tıkla

## Alternatif: Blueprint'i Yeniden Deploy Et

Eğer Blueprint kullanıyorsan:

1. Blueprint'i sil (veya yeni bir tane oluştur)
2. GitHub repo'yu tekrar bağla
3. `render.yaml` otomatik okunacak

## Doğru Build Command

```
npm install && npx prisma generate && npm run build
```

**NOT:** `npm ci` yerine `npm install` kullanıyoruz çünkü `package-lock.json` yok.

## Start Command (zaten doğru olmalı)

```
npm run prisma:deploy && npm start
```

Bu adımları yaptıktan sonra deploy başarılı olmalı! 🚀

