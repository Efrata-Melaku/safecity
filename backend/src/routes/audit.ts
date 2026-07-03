import express from 'express';
import prisma from '../config/prisma.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateAdmin, async (_req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
});

export default router;
