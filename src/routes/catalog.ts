import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/about', async (_req, res) => {
  res.json({
    data: {
      hospital_name: "Medora Hospital",
      hero: {
        title: "Medora",
        subtitle: "Healthcare, Simplified.",
        image_url: "https://i.pinimg.com/1200x/9b/e2/12/9be212df4fc8537ddc31c3f7fa147b42.jpg",
        left_icon: "waveform.path.ecg"
      },
      mission: {
        title: "OUR MISSION",
        text: "Healthcare should not be complicated, stressful, or time-consuming.At Medora, our mission is to make healthcare accessible, transparent, and human-centered for everyone.We help patients easily discover qualified specialists, book appointments instantly, and feel confident that their medical information is protected. Medora is designed to support users at every step of their healthcare journey — from the first search to ongoing care.Because when healthcare is simple, people can focus on living healthier lives."
      },
      why: {
        title: "WHY MEDORA?",
        items: [
          {
            id: 1,
            icon: "checkmark.seal.fill",
            title: "Verified Specialists",
            subtitle: "Doctors are reviewed for quality care.",
            order: 1
          },
          {
            id: 2,
            icon: "calendar",
            title: "Instant Booking",
            subtitle: "Book appointments in seconds.",
            order: 2
          },
          {
            id: 3,
            icon: "lock.fill",
            title: "Secure Records",
            subtitle: "Your data stays private and protected.",
            order: 3
          }
        ]
      },
      updated_at: new Date().toISOString()
    }
  });
});

router.get('/categories', async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json({ data: categories });
});

router.get('/doctors', async (req, res) => {
  const { categoryId, q, page = '1', limit = '6' } = req.query as { 
    categoryId?: string; 
    q?: string; 
    page?: string; 
    limit?: string;
  };
  
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 6;
  const skip = (pageNum - 1) * limitNum;

  const whereConditions: any[] = [];
  if (categoryId) {
    whereConditions.push({ categoryId });
  }
  if (q) {
    whereConditions.push({
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { specialization: { contains: q, mode: 'insensitive' } }
      ]
    });
  }

  const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

  const [doctors, total] = await Promise.all([
    prisma.doctor.findMany({
      where,
      orderBy: { ratingAverage: 'desc' },
      skip,
      take: limitNum
    }),
    prisma.doctor.count({ where })
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.json({ 
    data: doctors,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    }
  });
});

export default router;
