import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '50kb' }));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is healthy' }));
app.use(['/api/tasks', '/tasks'], taskRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
