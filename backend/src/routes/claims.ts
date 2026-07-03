import express from 'express';
import prisma from '../config/prisma.js';

const router = express.Router();

router.get('/:claimCode', async (req, res, next) => {
  try {
    const claimCode = req.params.claimCode.trim().toUpperCase();
    const report = await prisma.report.findUnique({ where: { claimCode } });
    if (!report) {
      res.status(404).json({ success: false, message: 'Claim not found' });
      return;
    }
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
});

export default router;
