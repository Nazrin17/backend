import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import type { UploadedFile } from 'express-fileupload';

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

// Doctor photoUrl'ini direkt URL string ile güncelleme endpoint'i
const updatePhotoUrlSchema = z.object({ photoUrl: z.string().url() });
router.put('/:id/photoUrl', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Doctor'un var olup olmadığını kontrol et
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Request body validation
    const parse = updatePhotoUrlSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid photoUrl. Must be a valid URL string.' });
    }

    const { photoUrl } = parse.data;

    // Doctor'un photoUrl'ini güncelle
    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: { photoUrl },
      select: {
        id: true,
        name: true,
        specialization: true,
        photoUrl: true,
        experienceYrs: true,
        patientsCount: true,
        feeCents: true,
        ratingAverage: true,
        ratingCount: true
      }
    });

    res.json({ 
      data: {
        message: 'Doctor photoUrl updated successfully',
        doctor: updatedDoctor
      }
    });
  } catch (error: any) {
    console.error('Doctor photoUrl update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update doctor photoUrl' });
  }
});

// Doctor fotoğrafı yükleme endpoint'i (file upload)
router.put('/:id/photo', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Doctor'un var olup olmadığını kontrol et
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Dosya kontrolü
    if (!req.files || !req.files.photo) {
      return res.status(400).json({ error: 'No photo file provided' });
    }

    const photo = req.files.photo as UploadedFile;
    
    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(photo.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Allowed types: jpeg, jpg, png, gif, webp' 
      });
    }

    // Dosyayı base64 string'e çevir
    const base64String = photo.data.toString('base64');
    const dataUrl = `data:${photo.mimetype};base64,${base64String}`;

    // Doctor'un photoUrl'ini güncelle
    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: { photoUrl: dataUrl },
      select: {
        id: true,
        name: true,
        specialization: true,
        photoUrl: true,
        experienceYrs: true,
        patientsCount: true,
        feeCents: true,
        ratingAverage: true,
        ratingCount: true
      }
    });

    res.json({ 
      data: {
        message: 'Doctor photo updated successfully',
        doctor: updatedDoctor
      }
    });
  } catch (error: any) {
    console.error('Doctor photo upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload doctor photo' });
  }
});

export default router;
