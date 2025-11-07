import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Get available time slots for a doctor on a specific date
router.get('/:doctorId/availability', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required (YYYY-MM-DD)' });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Parse requested date
    const requestedDate = new Date(date as string);
    const dateOnly = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), requestedDate.getDate());
    const nextDay = new Date(dateOnly.getTime() + 24 * 60 * 60 * 1000);

    // Get all appointments for this doctor on this date
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: dateOnly,
          lt: nextDay
        }
      }
    });

    // Get doctor's available slots
    let availableSlots: string[] = [];
    if (doctor.availableSlots) {
      try {
        availableSlots = JSON.parse(doctor.availableSlots) as string[];
      } catch (e) {
        // Invalid JSON
      }
    }

    // If no slots defined, return all day slots (default)
    if (availableSlots.length === 0) {
      availableSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return `${hour}:00`;
      });
    }

    // Get booked time slots
    const bookedSlots = appointments.map(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toTimeString().slice(0, 5); // HH:MM
    });

    // Filter out booked slots
    const freeSlots = availableSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      doctorId,
      date: dateOnly.toISOString().split('T')[0],
      availableSlots: availableSlots,
      bookedSlots: bookedSlots,
      freeSlots: freeSlots,
      totalAvailable: availableSlots.length,
      totalBooked: bookedSlots.length,
      totalFree: freeSlots.length
    });
  } catch (error: any) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: error.message || 'Failed to get availability' });
  }
});

export default router;

