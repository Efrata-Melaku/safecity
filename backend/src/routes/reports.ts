import express from 'express';
import prisma from '../config/prisma.js';
import { authenticateAdmin, type AuthenticatedRequest } from '../middleware/auth.js';
import { assignSchema, emailSchema, noteSchema, reportSchema, smsSchema, statusSchema } from '../validators/schemas.js';
import { sendEmail } from '../services/email.js';
import { sendSms } from '../services/sms.js';

const router = express.Router();

function generateClaimCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function getRequestContext(req: AuthenticatedRequest) {
  return {
    ipAddress: req.ip || req.headers['x-forwarded-for']?.toString() || undefined,
    browser: req.headers['user-agent'] || undefined,
  };
}

async function createAuditLog(req: AuthenticatedRequest, reportId: string | null, action: string, details?: string, result = 'success', target?: string, targetType?: string) {
  await prisma.auditLog.create({
    data: {
      action,
      target,
      targetType,
      details,
      result,
      adminId: req.admin?.id,
      reportId,
      ...getRequestContext(req),
    },
  });
}

router.post('/', async (req, res, next) => {
  try {
    const parsed = reportSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid report payload' });
      return;
    }

    const claimCode = generateClaimCode();
    const report = await prisma.report.create({
      data: {
        claimCode,
        abuseType: parsed.data.abuseType,
        otherAbuseType: parsed.data.otherAbuseType || null,
        description: parsed.data.description,
        location: parsed.data.location,
        incidentDate: parsed.data.incidentDate ? new Date(parsed.data.incidentDate) : null,
        contactPreference: parsed.data.contactPreference,
        contactValue: parsed.data.contactValue || null,
        anonymous: parsed.data.anonymous ?? false,
        reporterEmail: parsed.data.reporterEmail || null,
        reporterPhone: parsed.data.reporterPhone || null,
        priority: parsed.data.priority || 'medium',
        escalationStatus: parsed.data.escalationStatus || 'none',
      },
    });

    await createAuditLog(req as AuthenticatedRequest, report.id, 'Report submitted', `Claim code ${claimCode}`, 'success', report.id, 'report');
    res.status(201).json({ success: true, message: 'Report submitted', claimCode, report });
  } catch (error) {
    next(error);
  }
});

router.get('/', authenticateAdmin, async (req, res, next) => {
  try {
    const includeArchived = req.query.includeArchived === 'true';
    const reports = await prisma.report.findMany({
      where: includeArchived ? {} : { isArchived: false },
      orderBy: { createdAt: 'desc' },
      include: { assignedStaff: true },
    });
    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
});

router.get('/detail/:id', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        assignedStaff: true,
        auditLogs: { orderBy: { createdAt: 'desc' }, include: { admin: true } },
        reportNotes: { orderBy: { createdAt: 'desc' }, include: { author: true } },
        emailLogs: { orderBy: { sentAt: 'desc' } },
        communicationLogs: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!report) {
      res.status(404).json({ success: false, message: 'Report not found' });
      return;
    }

    await createAuditLog(req, report.id, 'Viewed report', 'Administrator opened report details', 'success', report.id, 'report');
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid status payload' });
      return;
    }

    const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: parsed.data.status as 'pending' | 'in_progress' | 'resolved',
        priority: parsed.data.priority || undefined,
        escalationStatus: parsed.data.escalationStatus || undefined,
        notes: parsed.data.notes || undefined,
      },
    });

    await createAuditLog(req, report.id, 'Updated report status', `Status changed to ${parsed.data.status}`, 'success', report.id, 'report');
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = req.body;
    const report = await prisma.report.update({
      where: { id: reportId },
      data: {
        abuseType: data.abuseType || undefined,
        otherAbuseType: data.otherAbuseType || undefined,
        description: data.description || undefined,
        location: data.location || undefined,
        incidentDate: data.incidentDate ? new Date(data.incidentDate) : undefined,
        contactPreference: data.contactPreference || undefined,
        contactValue: data.contactValue || undefined,
        anonymous: data.anonymous ?? undefined,
        reporterEmail: data.reporterEmail || undefined,
        reporterPhone: data.reporterPhone || undefined,
        priority: data.priority || undefined,
        escalationStatus: data.escalationStatus || undefined,
        notes: data.notes || undefined,
      },
    });

    await createAuditLog(req, report.id, 'Edited report', 'Administrator edited report details', 'success', report.id, 'report');
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/notes', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = noteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid note payload' });
      return;
    }

    const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const note = await prisma.reportNote.create({
      data: {
        reportId,
        authorId: req.admin?.id,
        content: parsed.data.content,
      },
      include: { author: true },
    });

    await createAuditLog(req, reportId, 'Added note', parsed.data.content, 'success', reportId, 'report');
    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/assign', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = assignSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid assignment payload' });
      return;
    }

    const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const assignment = await prisma.reportAssignment.create({
      data: {
        reportId,
        adminId: parsed.data.adminId,
        assignedById: req.admin?.id,
        notes: parsed.data.notes || null,
      },
      include: { admin: true },
    });

    await prisma.report.update({ where: { id: reportId }, data: { assignedStaffId: parsed.data.adminId } });
    await createAuditLog(req, reportId, 'Assigned staff', `Assigned ${parsed.data.adminId}`, 'success', reportId, 'report');
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/email', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = emailSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid email payload' });
      return;
    }

    const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await sendEmail({ to: parsed.data.recipient, subject: parsed.data.subject, text: parsed.data.message, from: parsed.data.sender });
    const emailLog = await prisma.emailLog.create({
      data: {
        reportId,
        adminId: req.admin?.id,
        recipient: parsed.data.recipient,
        sender: parsed.data.sender || req.admin?.email || 'admin@safehawassa.org',
        subject: parsed.data.subject,
        message: parsed.data.message,
        status: result.success ? 'sent' : 'failed',
        error: result.error || null,
      },
    });

    await prisma.communicationLog.create({
      data: {
        reportId,
        adminId: req.admin?.id,
        type: 'email',
        recipient: parsed.data.recipient,
        status: result.success ? 'sent' : 'failed',
        details: parsed.data.subject,
      },
    });

    await createAuditLog(req, reportId, 'Sent email', parsed.data.subject, result.success ? 'success' : 'failure', reportId, 'report');
    res.json({ success: result.success, emailLog });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/sms', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = smsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid SMS payload' });
      return;
    }

    const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await sendSms({ to: parsed.data.recipient, message: parsed.data.message });
    await prisma.communicationLog.create({
      data: {
        reportId,
        adminId: req.admin?.id,
        type: 'sms',
        recipient: parsed.data.recipient,
        status: result.success ? 'sent' : 'failed',
        details: parsed.data.message,
      },
    });

    await createAuditLog(req, reportId, 'Attempted SMS', parsed.data.message, result.success ? 'success' : 'failure', reportId, 'report');
    res.json({ success: result.success, result });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/call', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await prisma.communicationLog.create({
      data: {
        reportId,
        adminId: req.admin?.id,
        type: 'call',
        recipient: req.body.recipient || null,
        status: 'sent',
        details: 'Attempted phone call to victim',
      },
    });

    await createAuditLog(req, reportId, 'Attempted call', 'Admin logged a phone call attempt', 'success', reportId, 'report');
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/archive', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const report = await prisma.report.update({ where: { id: reportId }, data: { isArchived: true } });
    await createAuditLog(req, report.id, 'Archived report', 'Report moved to archive', 'success', report.id, 'report');
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/restore', authenticateAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const reportId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const report = await prisma.report.update({ where: { id: reportId }, data: { isArchived: false } });
    await createAuditLog(req, report.id, 'Restored report', 'Report restored from archive', 'success', report.id, 'report');
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
});

export default router;
