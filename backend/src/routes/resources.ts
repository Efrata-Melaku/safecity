import express from 'express';
import prisma from '../config/prisma.js';
import { authenticateAdmin, type AuthenticatedRequest } from '../middleware/auth.js';
import { resourceSchema } from '../validators/schemas.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const includeArchived = req.query.includeArchived === 'true';
    const where = includeArchived ? {} : { isActive: true };
    const resources = await prisma.supportResource.findMany({ where, orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }] });
    res.json({ success: true, resources });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = resourceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid resource payload' });
      return;
    }

    const resource = await prisma.supportResource.create({ data: { ...parsed.data, displayOrder: parsed.data.displayOrder ?? 0, isActive: parsed.data.isActive ?? true } });
    await prisma.auditLog.create({ data: { action: 'Added contact', target: resource.id, adminId: req.admin?.id, details: 'Added new emergency contact' } });
    res.status(201).json({ success: true, resource });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const resource = await prisma.supportResource.update({ where: { id: resourceId }, data: req.body });
    await prisma.auditLog.create({ data: { action: 'Updated contact', target: resource.id, adminId: req.admin?.id, details: 'Updated emergency contact details' } });
    res.json({ success: true, resource });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/archive', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const resource = await prisma.supportResource.update({ where: { id: resourceId }, data: { isActive: false } });
    await prisma.auditLog.create({ data: { action: 'Archived contact', target: resource.id, adminId: req.admin?.id, details: 'Archived emergency contact' } });
    res.json({ success: true, resource });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/restore', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const resourceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const resource = await prisma.supportResource.update({ where: { id: resourceId }, data: { isActive: true } });
    await prisma.auditLog.create({ data: { action: 'Restored contact', target: resource.id, adminId: req.admin?.id, details: 'Restored emergency contact' } });
    res.json({ success: true, resource });
  } catch (error) {
    next(error);
  }
});

export default router;
