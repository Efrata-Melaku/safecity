import express from 'express';
import prisma from '../config/prisma.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateAdmin, async (_req, res, next) => {
  try {
    const pending = await prisma.report.count({ where: { status: 'pending' } });
    const inProgress = await prisma.report.count({ where: { status: 'in_progress' } });
    const resolved = await prisma.report.count({ where: { status: 'resolved' } });
    const critical = await prisma.report.count({ where: { isCritical: true } });
    const reportsToday = await prisma.report.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } });
    res.json({ success: true, stats: { pending, inProgress, resolved, critical, reportsToday } });
  } catch (error) {
    next(error);
  }
});

export default router;
