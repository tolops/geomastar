import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import searchRoutes from './routes/search';
import authRoutes from './auth/routes';
import locationsRoutes from './routes/locations';
import reportRoutes from './routes/reports';
import businessesRoutes from './routes/businesses';

const app = express();

app.use(cors());
app.use(express.json());

// Register Routes
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/businesses', businessesRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
