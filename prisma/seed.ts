import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { name: 'Demo User', email: 'demo@example.com', passwordHash }
  });

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

  const neuro = await prisma.category.upsert({
    where: { name: 'Neurology' },
    update: {},
    create: { name: 'Neurology' }
  });
  const cardio = await prisma.category.upsert({
    where: { name: 'Cardiology' },
    update: {},
    create: { name: 'Cardiology' }
  });

  const dr1 = await prisma.doctor.upsert({
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

  await prisma.review.create({
    data: { rating: 5, comment: 'Excellent care.', userId: user.id, doctorId: dr1.id }
  });

  const dr2 = await prisma.doctor.create({
    data: {
      name: 'Dr. Maria Elena',
      specialization: 'Psychologist',
      experienceYrs: 8,
      patientsCount: 3000,
      feeCents: 5999,
      ratingAverage: 4.9,
      ratingCount: 120,
      distanceM: 1500,
      categoryId: neuro.id
    }
  });

  await prisma.doctor.create({
    data: {
      name: 'Dr. Marcus Horizon',
      specialization: 'Cardiologist',
      experienceYrs: 12,
      patientsCount: 5000,
      feeCents: 6999,
      ratingAverage: 4.7,
      ratingCount: 200,
      distanceM: 800,
      categoryId: cardio.id
    }
  });
}

main().finally(async () => prisma.$disconnect());
