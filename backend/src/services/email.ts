import nodemailer from 'nodemailer';

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail({ to, subject, text, from }: { to: string; subject: string; text: string; from?: string }): Promise<EmailSendResult> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const defaultFrom = process.env.EMAIL_FROM || process.env.SMTP_USER || 'safe-city-hawassa@example.com';

  if (!host || !user || !pass) {
    return { success: false, error: 'SMTP service is not configured.' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from: from || defaultFrom,
    to,
    subject,
    text,
  });

  return { success: true, messageId: info.messageId };
}
