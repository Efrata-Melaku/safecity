import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function loginAdmin(payload: { email: string; password: string }) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function getDashboardStats() {
  const { data } = await api.get('/dashboard');
  return data;
}

export async function getResources(includeArchived = false) {
  const { data } = await api.get('/resources', { params: { includeArchived } });
  return data;
}

export async function submitReport(payload: Record<string, unknown>) {
  const { data } = await api.post('/reports', payload);
  return data;
}

export async function getReports(includeArchived = false) {
  const { data } = await api.get('/reports', { params: { includeArchived } });
  return data;
}

export async function getReport(id: string) {
  const { data } = await api.get(`/reports/detail/${id}`);
  return data;
}

export async function updateReport(id: string, payload: Record<string, unknown>) {
  const { data } = await api.patch(`/reports/${id}`, payload);
  return data;
}

export async function updateReportStatus(id: string, payload: Record<string, unknown>) {
  const { data } = await api.patch(`/reports/${id}/status`, payload);
  return data;
}

export async function addReportNote(id: string, payload: Record<string, unknown>) {
  const { data } = await api.post(`/reports/${id}/notes`, payload);
  return data;
}

export async function assignReport(id: string, payload: Record<string, unknown>) {
  const { data } = await api.post(`/reports/${id}/assign`, payload);
  return data;
}

export async function archiveReport(id: string) {
  const { data } = await api.patch(`/reports/${id}/archive`);
  return data;
}

export async function restoreReport(id: string) {
  const { data } = await api.patch(`/reports/${id}/restore`);
  return data;
}

export async function sendReportEmail(id: string, payload: Record<string, unknown>) {
  const { data } = await api.post(`/reports/${id}/email`, payload);
  return data;
}

export async function sendReportSms(id: string, payload: Record<string, unknown>) {
  const { data } = await api.post(`/reports/${id}/sms`, payload);
  return data;
}

export async function logReportCall(id: string, payload: Record<string, unknown> = {}) {
  const { data } = await api.post(`/reports/${id}/call`, payload);
  return data;
}

export async function getStaff() {
  const { data } = await api.get('/admin/staff');
  return data;
}

export async function createResource(payload: Record<string, unknown>) {
  const { data } = await api.post('/resources', payload);
  return data;
}

export async function updateResource(id: string, payload: Record<string, unknown>) {
  const { data } = await api.put(`/resources/${id}`, payload);
  return data;
}

export async function archiveResource(id: string) {
  const { data } = await api.patch(`/resources/${id}/archive`);
  return data;
}

export async function restoreResource(id: string) {
  const { data } = await api.patch(`/resources/${id}/restore`);
  return data;
}

export async function getClaimStatus(claimCode: string) {
  const normalizedClaimCode = claimCode.trim().toUpperCase();
  const { data } = await api.get(`/claims/${encodeURIComponent(normalizedClaimCode)}`);
  return data;
}

export async function getAuditLogs() {
  const { data } = await api.get('/audit-logs');
  return data;
}

export async function getSettings() {
  const { data } = await api.get('/settings');
  return data;
}

export default api;
