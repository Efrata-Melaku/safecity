export type Language = 'en' | 'am';

export interface ReportDraft {
  abuseType: string;
  description: string;
  location: string;
  incidentDate: string;
  contactPreference: string;
  contactValue: string;
  notes?: string;
}

export interface ReportResponse {
  id: string;
  claimCode: string;
  status: string;
  createdAt: string;
  priority?: string;
  isArchived?: boolean;
  assignedStaff?: { id: string; name?: string; email: string } | null;
}

export interface ReportDetail extends ReportResponse {
  abuseType: string;
  otherAbuseType?: string | null;
  description: string;
  location: string;
  incidentDate?: string | null;
  contactPreference: string;
  contactValue?: string | null;
  anonymous?: boolean;
  reporterEmail?: string | null;
  reporterPhone?: string | null;
  escalationStatus?: string;
  auditLogs?: AuditLogItem[];
  reportNotes?: ReportNoteItem[];
  emailLogs?: EmailLogItem[];
  communicationLogs?: CommunicationLogItem[];
}

export interface ReportNoteItem {
  id: string;
  content: string;
  createdAt: string;
  author?: { name?: string; email: string } | null;
}

export interface EmailLogItem {
  id: string;
  recipient: string;
  subject: string;
  status: string;
  sentAt: string;
  sender?: string | null;
}

export interface CommunicationLogItem {
  id: string;
  type: string;
  recipient?: string | null;
  status: string;
  details?: string | null;
  createdAt: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  alternativePhone?: string;
  email?: string;
  website?: string;
  address?: string;
  googleMapsLink?: string;
  category?: string;
  availability?: string;
  workingDays?: string;
  workingHours?: string;
  priority?: string;
  status?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface StaffItem {
  id: string;
  email: string;
  name?: string | null;
  role?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  createdAt: string;
  adminEmail?: string;
  details?: string | null;
  result?: string;
  admin?: { email?: string; name?: string } | null;
}

export interface DashboardStats {
  pending: number;
  inProgress: number;
  resolved: number;
  critical: number;
  reportsToday: number;
}
