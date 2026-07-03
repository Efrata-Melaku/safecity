import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import prisma from '../config/prisma.js';
import { env } from '../config/env.js';
import { loginSchema } from '../validators/schemas.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

function generateClaimCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const admin = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
    if (!admin || !bcrypt.compareSync(parsed.data.password, admin.passwordHash)) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const accessToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, env.jwtSecret, { expiresIn: '15m' });
    const refreshToken = randomUUID();
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        adminUserId: admin.id,
      },
    });

    res.json({ success: true, message: 'Signed in', accessToken, refreshToken, user: { id: admin.id, email: admin.email, role: admin.role } });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const token = req.body.refreshToken as string | undefined;
    if (!token) {
      res.status(400).json({ success: false, message: 'Refresh token required' });
      return;
    }

    const existing = await prisma.refreshToken.findUnique({ where: { token } });
    if (!existing || existing.expiresAt < new Date()) {
      res.status(401).json({ success: false, message: 'Invalid refresh token' });
      return;
    }

    const admin = await prisma.adminUser.findUnique({ where: { id: existing.adminUserId } });
    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid refresh token' });
      return;
    }

    const accessToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, env.jwtSecret, { expiresIn: '15m' });
    res.json({ success: true, accessToken });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const admin = await prisma.adminUser.findUnique({ where: { id: req.admin?.id } });
    res.json({ success: true, admin });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const token = req.body.refreshToken as string | undefined;
    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }
    res.json({ success: true, message: 'Signed out' });
  } catch (error) {
    next(error);
  }
});

export default router;
