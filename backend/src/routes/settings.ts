import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateAdmin, (_req, res) => {
  res.json({ success: true, settings: { language: 'en', emergencyMode: false, lowBandwidthMode: false } });
});

router.put('/', authenticateAdmin, (req, res) => {
  res.json({ success: true, settings: req.body });
});

export default router;
