import { OrganizationSummary } from './service.model';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED';
export type ReportStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED';

export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number?: string;
  role: 'CITIZEN' | 'ADMIN' | 'ORGANIZATION' | 'USER_ORGANIZER';
  account_status: AccountStatus;
  created_at: string;
}

export interface AdminOrganization extends OrganizationSummary {
  registration_number: string;
  created_at: string;
  start_date: string;
  supporting_documents: string[];
  rejection_reason?: string;
}

export interface AdminReport {
  id: string;
  subject: string;
  submitted_by: string;
  category: string;
  status: ReportStatus;
  created_at: string;
  description: string;
}

export interface AdminActivity {
  id: string;
  action: string;
  actor: string;
  created_at: string;
}
