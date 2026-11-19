import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { AdminOrganization } from '../models/admin.model';
import { GatherlyEvent } from '../models/event.model';
import { OrganizationRegistration } from '../models/organization-dashboard.model';
import { GatherlyService } from '../models/service.model';
import { AdminDataService } from './admin-data.service';

@Injectable({ providedIn: 'root' })
export class OrganizationDataService {
  private readonly organizationProfile: AdminOrganization = {
    id: 201,
    organization_name: 'CareBridge Foundation',
    registration_number: 'NGO-KA-2021-0842',
    organization_address: '18 Green Avenue, Indiranagar, Bengaluru',
    website_url: 'https://example.org',
    profile_pic: '/assets/images/logo/gatherly-mark.svg',
    email_id: 'hello@carebridge.org',
    phone_no: '+91 98765 43210',
    verification_status: 'VERIFIED',
    verified_by_admin: 'Priya Menon',
    verification_date: '2026-09-14',
    description: 'CareBridge Foundation improves access to essential healthcare through community-led programs.',
    organization_type: 'NGO',
    created_at: '2026-08-20',
    start_date: '2021-08-12',
    supporting_documents: ['Registration certificate.pdf']
  };

  private readonly registrations: OrganizationRegistration[] = [];

  constructor(private readonly adminData: AdminDataService) {}

  getOrganization(): Observable<AdminOrganization> { return of({ ...this.organizationProfile }).pipe(delay(120)); }
  updateOrganization(profile: AdminOrganization): Observable<AdminOrganization> {
    Object.assign(this.organizationProfile, profile);
    return of({ ...this.organizationProfile }).pipe(delay(220));
  }
  getServices(): Observable<GatherlyService[]> {
    return this.adminData.getServices().pipe(map((services) => services.filter((service) => service.organization.organization_name === this.organizationProfile.organization_name)));
  }
  getEvents(): Observable<GatherlyEvent[]> {
    return this.adminData.getEvents().pipe(map((events) => events.filter((event) => event.organization.organization_name === this.organizationProfile.organization_name)));
  }
  getRegistrations(): Observable<OrganizationRegistration[]> {
    return this.getEvents().pipe(map((events) => events.map((event, index) => ({
      event,
      citizen_name: index ? 'Meera Iyer' : 'Aarav Sharma',
      email_id: index ? 'meera.iyer@example.com' : 'aarav.sharma@example.com',
      phone_number: index ? '+91 99887 12233' : '+91 98765 40000',
      registration_date: index ? '2026-11-17' : '2026-11-15',
      status: index ? 'REGISTERED' as const : 'ATTENDED' as const
    }))));
  }
}
