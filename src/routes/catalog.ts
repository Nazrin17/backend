import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

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
