import { describe, expect, it } from 'vitest';
import { reportSchema, loginSchema } from './schemas.js';

describe('reportSchema', () => {
  it('accepts a valid report payload', () => {
    const result = reportSchema.safeParse({
      abuseType: 'physical',
      description: 'An incident happened at the market',
      location: 'Hawassa',
      incidentDate: '2026-07-01',
      contactPreference: 'text',
      contactValue: '0911111111',
    });

    expect(result.success).toBe(true);
  });

  it('rejects short descriptions', () => {
    const result = reportSchema.safeParse({
      abuseType: 'physical',
      description: 'bad',
      location: 'Hawassa',
      contactPreference: 'text',
    });

    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('requires a valid email', () => {
    const result = loginSchema.safeParse({ email: 'invalid', password: 'password123' });
    expect(result.success).toBe(false);
  });
});
