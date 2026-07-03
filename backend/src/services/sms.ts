export interface SmsSendResult {
  success: boolean;
  provider?: string;
  error?: string;
}

export async function sendSms({ to, message }: { to: string; message: string }): Promise<SmsSendResult> {
  const provider = process.env.SMS_PROVIDER || 'local';

  if (provider === 'local') {
    return { success: true, provider: 'local' };
  }

  return { success: false, provider, error: 'SMS provider is not configured.' };
}
