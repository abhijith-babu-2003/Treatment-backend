import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db/db.js';
import authRoutes from './routes/authRoutes.js';
import treatmentRoutes from './routes/treatmentRoutes.js';
import { protect } from './middleware/auth.js';

dotenv.config();


connectDB();

const app = express();


app.use(cors({
  origin: process.env.CORS_ORIGIN, 
  credentials: true
}));

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/treatments', protect, treatmentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});