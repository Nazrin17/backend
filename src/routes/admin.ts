import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

const doctorSchema = z.object({
  name: z.string().min(1),
  specialization: z.string().min(1),
  photoUrl: z.string().optional(),
  experienceYrs: z.number().int().min(0).default(0),
  patientsCount: z.number().int().min(0).default(0),
  feeCents: z.number().int().min(0).default(0),
  ratingAverage: z.number().min(0).max(5).default(0),
  ratingCount: z.number().int().min(0).default(0),
  distanceM: z.number().int().optional(),
  categoryId: z.string()
});

// Create doctor (admin endpoint)
router.post('/', async (req, res) => {
  try {
    const parse = doctorSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json(parse.error.flatten());
    
    const { name, specialization, photoUrl, experienceYrs, patientsCount, feeCents, ratingAverage, ratingCount, distanceM, categoryId } = parse.data;
    
    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialization,
        photoUrl,
        experienceYrs,
        patientsCount,
        feeCents,
        ratingAverage,
        ratingCount,
        distanceM,
        categoryId
      },
      include: { category: true }
    });
    
    res.status(201).json({ data: doctor });
  } catch (error: any) {
    console.error('Admin create doctor error:', error);
    res.status(500).json({ error: error.message || 'Failed to create doctor' });
  }
});

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: { category: true },
      orderBy: { name: 'asc' }
    });
    res.json({ data: doctors });
  } catch (error: any) {
    console.error('Admin get doctors error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch doctors' });
  }
});

export default router;

