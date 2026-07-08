import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';
import claimRoutes from './routes/claims.js';
import resourceRoutes from './routes/resources.js';
import dashboardRoutes from './routes/dashboard.js';
import adminRoutes from './routes/admin.js';
import auditRoutes from './routes/audit.js';
import settingsRoutes from './routes/settings.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "https://safecity-frontend-chi.vercel.app/",
    credentials: true,
  })
);app.use(morgan('dev'));
app.use(express.json());
app.use(generalLimiter);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Safe City Hawassa backend is running' });
});
app.get("/api", (req, res) => {
  res.json({ message: "API is working" });
});
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/settings', settingsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
