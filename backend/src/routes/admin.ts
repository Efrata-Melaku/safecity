import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import { authenticateAdmin, type AuthenticatedRequest } from '../middleware/auth.js';

const router = express.Router();

router.get('/staff', authenticateAdmin, async (_req, res, next) => {
  try {
    const staff = await prisma.adminUser.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, staff });
  } catch (error) {
    next(error);
  }
});

router.post('/staff', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password || 'password123', 10);
    const staff = await prisma.adminUser.create({
      data: {
        email: req.body.email,
        passwordHash,
        name: req.body.name,
        role: req.body.role || 'staff',
      },
    });
    await prisma.auditLog.create({ data: { action: 'Added staff', target: staff.id, adminId: req.admin?.id } });
    res.status(201).json({ success: true, staff });
  } catch (error) {
    next(error);
  }
});

export default router;
