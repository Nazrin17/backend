import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const router = Router();

const categorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional()
});

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

// ===== CATEGORIES =====

// Create category
router.post('/categories', async (req, res) => {
  try {
    const parse = categorySchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json(parse.error.flatten());
    
    const { name, icon } = parse.data;
    
    const category = await prisma.category.create({
      data: { name, icon }
    });
    
    res.status(201).json({ data: category });
  } catch (error: any) {
    console.error('Admin create category error:', error);
    res.status(500).json({ error: error.message || 'Failed to create category' });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ data: categories });
  } catch (error: any) {
    console.error('Admin get categories error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch categories' });
  }
});

// Delete all categories
router.delete('/categories', async (req, res) => {
  try {
    const result = await prisma.category.deleteMany({});
    res.json({ 
      message: 'All categories deleted successfully',
      deletedCount: result.count
    });
  } catch (error: any) {
    console.error('Admin delete categories error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete categories' });
  }
});

// Delete category by ID
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id }
    });
    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Admin delete category error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete category' });
  }
});

// ===== DOCTORS =====

// Create doctor
router.post('/doctors', async (req, res) => {
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
router.get('/doctors', async (req, res) => {
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

// Delete all doctors
router.delete('/doctors', async (req, res) => {
  try {
    const result = await prisma.doctor.deleteMany({});
    res.json({ 
      message: 'All doctors deleted successfully',
      deletedCount: result.count
    });
  } catch (error: any) {
    console.error('Admin delete doctors error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete doctors' });
  }
});

// Delete doctor by ID
router.delete('/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.doctor.delete({
      where: { id }
    });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error: any) {
    console.error('Admin delete doctor error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete doctor' });
  }
});

// ===== SEED =====

// Seed initial data
router.post('/seed', async (req, res) => {
  try {
    // Create demo user
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: { name: 'Demo User', email: 'demo@example.com', passwordHash }
    });

    // Create categories
    const categories = await prisma.category.createMany({
      data: [
        { name: 'Doctor', icon: 'stethoscope' },
        { name: 'Pharmacy', icon: 'pill' },
        { name: 'Hospital', icon: 'hospital' },
        { name: 'Ambulance', icon: 'ambulance' },
        { name: 'Neurology', icon: 'brain' },
        { name: 'Cardiology', icon: 'heart' }
      ],
      skipDuplicates: true
    });

    const neuro = await prisma.category.findFirst({ where: { name: 'Neurology' } });
    const cardio = await prisma.category.findFirst({ where: { name: 'Cardiology' } });

    if (neuro && cardio) {
      // Create sample doctors
      await prisma.doctor.upsert({
        where: { id: 'seed-neuro-1' },
        update: {},
        create: {
          id: 'seed-neuro-1',
          name: 'Dr. Hannibal Lector',
          specialization: 'Psychiatrist',
          experienceYrs: 10,
          patientsCount: 7500,
          feeCents: 6499,
          ratingAverage: 4.5,
          ratingCount: 87,
          distanceM: 500,
          categoryId: neuro.id
        }
      });

      await prisma.review.createMany({
        data: [
          { rating: 5, comment: 'Excellent care.', userId: user.id, doctorId: 'seed-neuro-1' }
        ],
        skipDuplicates: true
      });
    }

    res.json({ 
      message: 'Seed data created successfully',
      categories: categories.count,
      user: user.email
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    res.status(500).json({ error: error.message || 'Failed to seed data' });
  }
});

export default router;
