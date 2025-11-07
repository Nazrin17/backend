import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';

import authRouter from './routes/auth.js';
import catalogRouter from './routes/catalog.js';
import doctorRouter from './routes/doctor.js';
import appointmentRouter from './routes/appointment.js';
import adminRouter from './routes/admin.js';
import availabilityRouter from './routes/availability.js';

const app = express();
const prisma = new PrismaClient();

// Test database connection on startup
prisma.$connect().catch((err) => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', async (_req, res) => {
  try {
    const now = await prisma.$queryRaw`SELECT NOW()`;
    res.json({ status: 'ok', now });
  } catch (error: any) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.use('/auth', authRouter);
app.use('/catalog', catalogRouter);
app.use('/admin', adminRouter);
app.use('/doctors', doctorRouter);
app.use('/appointments', appointmentRouter);
app.use('/availability', availabilityRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
