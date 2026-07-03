import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const reportSchema = z.object({
  abuseType: z.string().min(1),
  otherAbuseType: z.string().optional(),
  description: z.string().min(10),
  location: z.string().min(3),
  incidentDate: z.string().optional(),
  contactPreference: z.string().min(1),
  contactValue: z.string().optional(),
  anonymous: z.boolean().optional(),
  reporterEmail: z.string().optional(),
  reporterPhone: z.string().optional(),
  priority: z.string().optional(),
  escalationStatus: z.string().optional(),
});

export const resourceSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  phone: z.string().optional(),
  alternativePhone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  googleMapsLink: z.string().optional(),
  category: z.string().optional(),
  availability: z.string().optional(),
  workingDays: z.string().optional(),
  workingHours: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  displayOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const statusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved']),
  notes: z.string().optional(),
  priority: z.string().optional(),
  escalationStatus: z.string().optional(),
});

export const noteSchema = z.object({
  content: z.string().min(1),
});

export const assignSchema = z.object({
  adminId: z.string().min(1),
  notes: z.string().optional(),
});

export const emailSchema = z.object({
  recipient: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
  sender: z.string().optional(),
});

export const smsSchema = z.object({
  recipient: z.string().min(1),
  message: z.string().min(1),
});
