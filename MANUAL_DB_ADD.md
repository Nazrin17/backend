# 🗄️ Database'e Manuel Veri Ekleme Rehberi

## Yöntem 1: Prisma Studio (Görsel Arayüz - Önerilen)

Render Shell'den:

```bash
npx prisma studio
```

Bu komut bir URL verecek (örn: `http://localhost:5555`). Ama Render Shell'de port forwarding olmayabilir.

## Yöntem 2: Render Shell'den Script ile (En Pratik)

### Doktor Ekleme Script'i:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    // Önce category'yi bul (veya oluştur)
    let category = await prisma.category.findFirst({ 
      where: { name: 'Neurology' } 
    });
    
    if (!category) {
      category = await prisma.category.create({
        data: { name: 'Neurology', icon: 'brain' }
      });
      console.log('Category oluşturuldu:', category);
    }
    
    // Doktor ekle
    const doctor = await prisma.doctor.create({
      data: {
        name: 'Dr. Yeni Doktor',
        specialization: 'Neurologist',
        experienceYrs: 5,
        patientsCount: 1000,
        feeCents: 5000,
        ratingAverage: 4.5,
        ratingCount: 50,
        distanceM: 1000,
        categoryId: category.id
      }
    });
    
    console.log('✅ Doktor eklendi:', doctor);
    await prisma.\$disconnect();
  } catch (error) {
    console.error('❌ Hata:', error.message);
    await prisma.\$disconnect();
    process.exit(1);
  }
})();
"
```

### Category Ekleme:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  const category = await prisma.category.create({
    data: { name: 'Dermatology', icon: 'skin' }
  });
  console.log('Category eklendi:', category);
  await prisma.\$disconnect();
})();
"
```

### User Ekleme:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

(async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      passwordHash
    }
  });
  console.log('User eklendi:', user);
  await prisma.\$disconnect();
})();
"
```

## Yöntem 3: Direkt SQL ile (PostgreSQL)

Render Dashboard → Database → "Connections" → "External Connection" string'ini kopyala.

Sonra local'de veya online PostgreSQL client'ta bağlan:

```sql
-- Category ekle
INSERT INTO "Category" (id, name, icon, "createdAt")
VALUES (gen_random_uuid()::text, 'Dermatology', 'skin', NOW());

-- Category ID'yi al
SELECT id FROM "Category" WHERE name = 'Dermatology';

-- Doktor ekle (category_id'yi yukarıdaki ID ile değiştir)
INSERT INTO "Doctor" (
  id, name, specialization, "experienceYrs", 
  "patientsCount", "feeCents", "ratingAverage", 
  "ratingCount", "distanceM", "categoryId"
)
VALUES (
  gen_random_uuid()::text,
  'Dr. Yeni Doktor',
  'Dermatologist',
  5,
  1000,
  5000,
  4.5,
  50,
  1000,
  'CATEGORY_ID_BURAYA'
);
```

## Yöntem 4: API Endpoint ile (Postman'den)

**POST** `https://your-api-url.onrender.com/admin/doctors`

Body:
```json
{
  "name": "Dr. Yeni Doktor",
  "specialization": "Neurologist",
  "experienceYrs": 5,
  "patientsCount": 1000,
  "feeCents": 5000,
  "ratingAverage": 4.5,
  "ratingCount": 50,
  "distanceM": 1000,
  "categoryId": "CATEGORY_ID"
}
```

## Hızlı Komutlar (Copy-Paste)

### Tüm Kategorileri Listele:
```bash
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.category.findMany().then(r=>{console.log(JSON.stringify(r,null,2));p.\$disconnect();});"
```

### Tüm Doktorları Listele:
```bash
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.doctor.findMany({include:{category:true}}).then(r=>{console.log(JSON.stringify(r,null,2));p.\$disconnect();});"
```

### Doktor Sil:
```bash
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.doctor.delete({where:{id:'DOCTOR_ID_BURAYA'}}).then(r=>{console.log('Silindi:',r);p.\$disconnect();});"
```

