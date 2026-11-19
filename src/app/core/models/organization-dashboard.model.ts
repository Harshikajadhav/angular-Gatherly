import { AdminOrganization } from './admin.model';
import { GatherlyEvent } from './event.model';
import { GatherlyService } from './service.model';

export interface OrganizationRegistration {
  event: GatherlyEvent;
  citizen_name: string;
  email_id: string;
  phone_number?: string;
  registration_date: string;
  status: 'REGISTERED' | 'ATTENDED' | 'CANCELLED';
}

export interface OrganizationDashboardData {
  organization: AdminOrganization;
  services: GatherlyService[];
  events: GatherlyEvent[];
  registrations: OrganizationRegistration[];
}
