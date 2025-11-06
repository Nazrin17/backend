import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

const bookSchema = z.object({
  userId: z.string(),
  date: z.string().transform((s) => new Date(s)),
  notes: z.string().optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional()
});

router.post('/:doctorId/book', async (req, res) => {
  const { doctorId } = req.params;
  const parse = bookSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error.flatten());
  const { userId, date, notes, gender, birthDate } = parse.data;
  const appt = await prisma.appointment.create({
    data: {
      userId,
      doctorId,
      date,
      notes,
      gender,
      birthDate: birthDate ? new Date(birthDate) : null
    }
  });
  res.status(201).json({ data: appt });
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const list = await prisma.appointment.findMany({ where: { userId }, orderBy: { date: 'desc' } });
  res.json({ data: list });
});

export default router;
