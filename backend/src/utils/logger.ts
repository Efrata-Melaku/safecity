export function logEvent(message: string, payload?: Record<string, unknown>) {
  if (payload) {
    console.info(message, payload);
    return;
  }
  console.info(message);
}
