import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: { category: true }
  });
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  res.json({ data: doctor });
});

router.get('/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const { page = '1', limit = '6' } = req.query as { page?: string; limit?: string };
  
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 6;
  const skip = (pageNum - 1) * limitNum;

  const where = { doctorId: id };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({ 
      where, 
      include: { user: true }, 
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum
    }),
    prisma.review.count({ where })
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.json({ 
    data: reviews,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    }
  });
});

const reviewSchema = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().min(1), userId: z.string() });
router.post('/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const parse = reviewSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());
  const { rating, comment, userId } = parse.data;
  const review = await prisma.review.create({ 
    data: { 
      rating, 
      comment, 
      userId, 
      doctorId: id 
    } 
  });
  res.status(201).json({ data: review });
});

export default router;
