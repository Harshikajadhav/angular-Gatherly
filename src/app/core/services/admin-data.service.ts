import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { AdminActivity, AdminOrganization, AdminReport, AdminUser, ReportStatus } from '../models/admin.model';
import { CitizenProfile } from '../models/dashboard.model';
import { GatherlyEvent } from '../models/event.model';
import { GatherlyService } from '../models/service.model';
import { EventDiscoveryService } from './event-discovery.service';
import { ServiceDiscoveryService } from './service-discovery.service';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly profile: CitizenProfile = {
    first_name: 'Priya',
    last_name: 'Menon',
    email_id: 'priya.menon@gatherly.org',
    phone_number: '+91 98765 41111',
    address: 'Central Bengaluru',
    profile_pic: '/assets/images/logo/gatherly-mark.svg'
  };

  private readonly users: AdminUser[] = [
    { id: 'USR-1001', first_name: 'Aarav', last_name: 'Sharma', email_id: 'aarav.sharma@example.com', phone_number: '+91 98765 40000', role: 'CITIZEN', account_status: 'ACTIVE', created_at: '2026-11-18' },
    { id: 'USR-1002', first_name: 'Meera', last_name: 'Iyer', email_id: 'meera.iyer@example.com', phone_number: '+91 99887 12233', role: 'CITIZEN', account_status: 'ACTIVE', created_at: '2026-11-16' },
    { id: 'USR-1003', first_name: 'Rohan', last_name: 'Kapoor', email_id: 'rohan.kapoor@example.com', role: 'USER_ORGANIZER', account_status: 'ACTIVE', created_at: '2026-11-12' },
    { id: 'USR-1004', first_name: 'Priya', last_name: 'Menon', email_id: 'priya.menon@gatherly.org', phone_number: '+91 98765 41111', role: 'ADMIN', account_status: 'ACTIVE', created_at: '2026-01-08' },
    { id: 'USR-1005', first_name: 'Kabir', last_name: 'Das', email_id: 'kabir.das@example.com', phone_number: '+91 97654 32100', role: 'CITIZEN', account_status: 'SUSPENDED', created_at: '2026-10-28' }
  ];

  private readonly organizations: AdminOrganization[] = [
    { id: 201, organization_name: 'CareBridge Foundation', registration_number: 'NGO-KA-2021-0842', organization_address: '18 Green Avenue, Bengaluru', website_url: 'https://example.org', profile_pic: '/assets/images/logo/gatherly-mark.svg', email_id: 'hello@carebridge.org', phone_no: '+91 98765 43210', verification_status: 'VERIFIED', verified_by_admin: 'Priya Menon', verification_date: '2026-09-14', description: 'Community-led healthcare and welfare programs.', organization_type: 'NGO', created_at: '2026-08-20', start_date: '2021-08-12', supporting_documents: ['Registration certificate.pdf'] },
    { id: 202, organization_name: 'Nayi Disha Collective', registration_number: 'NGO-MH-2026-0198', organization_address: '7 Marine Plaza, Mumbai', website_url: 'https://example.org', profile_pic: '/assets/images/logo/gatherly-mark.svg', email_id: 'team@nayidisha.org', phone_no: '+91 98989 67676', verification_status: 'PENDING', description: 'A community organization supporting inclusive local initiatives.', organization_type: 'Nonprofit', created_at: '2026-11-17', start_date: '2024-04-10', supporting_documents: ['Trust deed.pdf', 'Board resolution.pdf'] },
    { id: 203, organization_name: 'NextStep Learning Trust', registration_number: 'EDU-MH-2024-0311', organization_address: '42 Learning Road, Pune', website_url: 'https://example.org', profile_pic: '/assets/images/logo/gatherly-mark.svg', email_id: 'training@nextstep.org', phone_no: '+91 99876 54321', verification_status: 'VERIFIED', verified_by_admin: 'Priya Menon', verification_date: '2026-08-22', description: 'Accessible learning and employability programs.', organization_type: 'Educational Institution', created_at: '2026-08-19', start_date: '2024-01-15', supporting_documents: ['Registration certificate.pdf'] },
    { id: 204, organization_name: 'Common Ground Delhi', registration_number: 'ORG-DL-2026-0440', organization_address: '31 Nehru Nagar, New Delhi', email_id: 'help@commonground.org', phone_no: '+91 98111 22334', verification_status: 'PENDING', description: 'Local community resource and volunteer support.', organization_type: 'Community Organization', created_at: '2026-11-15', start_date: '2025-06-02', supporting_documents: ['Organization profile.pdf'] }
  ];

  private readonly reports: AdminReport[] = [
    { id: 'RPT-104', subject: 'Incorrect event information', submitted_by: 'Meera Iyer', category: 'Event', status: 'OPEN', created_at: '2026-11-18', description: 'The event location appears to be outdated.' },
    { id: 'RPT-103', subject: 'Organization profile review', submitted_by: 'Aarav Sharma', category: 'Organization', status: 'IN_REVIEW', created_at: '2026-11-16', description: 'Please review the contact information on this profile.' },
    { id: 'RPT-102', subject: 'Duplicate service listing', submitted_by: 'Rohan Kapoor', category: 'Service', status: 'RESOLVED', created_at: '2026-11-10', description: 'Two listings appear to describe the same service.' }
  ];

  private readonly activities: AdminActivity[] = [
    { id: 'ACT-1', action: 'Approved CareBridge Foundation', actor: 'Priya Menon', created_at: 'Today, 10:42 AM' },
    { id: 'ACT-2', action: 'Reviewed report RPT-103', actor: 'Priya Menon', created_at: 'Yesterday, 4:18 PM' },
    { id: 'ACT-3', action: 'Registered new event: Green Streets Volunteer Day', actor: 'System', created_at: 'Yesterday, 1:05 PM' },
    { id: 'ACT-4', action: 'Created citizen account for Meera Iyer', actor: 'System', created_at: 'Nov 16, 2026' }
  ];

  constructor(
    private readonly eventService: EventDiscoveryService,
    private readonly serviceService: ServiceDiscoveryService
  ) {}

  getProfile(): Observable<CitizenProfile> { return of({ ...this.profile }).pipe(delay(120)); }
  updateProfile(profile: CitizenProfile): Observable<CitizenProfile> { Object.assign(this.profile, profile); return of({ ...this.profile }).pipe(delay(220)); }
  getUsers(): Observable<AdminUser[]> { return of([...this.users]).pipe(delay(180)); }
  getOrganizations(): Observable<AdminOrganization[]> { return of([...this.organizations]).pipe(delay(180)); }
  getReports(): Observable<AdminReport[]> { return of([...this.reports]).pipe(delay(180)); }
  getActivities(): Observable<AdminActivity[]> { return of([...this.activities]).pipe(delay(180)); }
  getEvents(): Observable<GatherlyEvent[]> { return this.eventService.getEvents(); }
  getServices(): Observable<GatherlyService[]> { return this.serviceService.getServices(); }
  getPendingOrganizations(): AdminOrganization[] { return this.organizations.filter((organization) => organization.verification_status === 'PENDING'); }

  updateOrganizationStatus(id: number, status: 'VERIFIED' | 'UNVERIFIED', reason?: string): void {
    const organization = this.organizations.find((item) => item.id === id);
    if (!organization) return;
    organization.verification_status = status;
    organization.verified_by_admin = status === 'VERIFIED' ? this.profile.first_name + ' ' + this.profile.last_name : undefined;
    organization.verification_date = status === 'VERIFIED' ? new Date().toISOString().slice(0, 10) : undefined;
    organization.rejection_reason = reason;
  }

  updateReportStatus(id: string, status: ReportStatus): void {
    const report = this.reports.find((item) => item.id === id);
    if (report) report.status = status;
  }
}
