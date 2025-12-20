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
  try {
    const { doctorId } = req.params;
    const parse = bookSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json(parse.error.flatten());
    const { userId, date, notes, gender, birthDate } = parse.data;

    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Extract date and time from appointment date
    const appointmentDate = new Date(date);
    const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());
    const appointmentTime = appointmentDate.toTimeString().slice(0, 5); // HH:MM format

    // Check if doctor has available slots defined
    if (doctor.availableSlots) {
      try {
        const availableSlots = JSON.parse(doctor.availableSlots) as string[];
        if (!availableSlots.includes(appointmentTime)) {
          return res.status(400).json({ 
            error: 'Time slot not available',
            availableSlots,
            requestedTime: appointmentTime
          });
        }
      } catch (e) {
        // Invalid JSON, ignore
      }
    }

    // Check if this exact time slot is already booked
    // Get all appointments for this doctor on this date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: appointmentDateOnly,
          lt: new Date(appointmentDateOnly.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    // Check if requested time slot is already taken
    const conflictingAppointment = existingAppointments.find(apt => {
      const aptTime = new Date(apt.date).toTimeString().slice(0, 5);
      return aptTime === appointmentTime;
    });

    if (conflictingAppointment) {
      return res.status(409).json({ 
        error: 'This time slot is already booked',
        bookedTime: appointmentTime,
        date: appointmentDateOnly.toISOString().split('T')[0],
        existingAppointmentId: conflictingAppointment.id
      });
    }

    // Create appointment
    const appt = await prisma.appointment.create({
      data: {
        userId,
        doctorId,
        date: appointmentDate,
        notes,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null
      }
    });
    
    res.status(201).json({ data: appt });
  } catch (error: any) {
    console.error('Appointment booking error:', error);
    res.status(500).json({ error: error.message || 'Failed to book appointment' });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const list = await prisma.appointment.findMany({ 
    where: { userId }, 
    orderBy: { date: 'desc' },
    include: {
      doctor: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  res.json({ data: list });
});

export default router;
