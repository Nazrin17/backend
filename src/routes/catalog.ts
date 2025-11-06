import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/categories', async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json({ data: categories });
});

router.get('/doctors', async (req, res) => {
  const { categoryId, q } = req.query as { categoryId?: string; q?: string };
  const doctors = await prisma.doctor.findMany({
    where: {
      AND: [
        categoryId ? { categoryId } : {},
        q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { specialization: { contains: q, mode: 'insensitive' } }] } : {}
      ]
    },
    orderBy: { ratingAverage: 'desc' }
  });
  res.json({ data: doctors });
});

export default router;
