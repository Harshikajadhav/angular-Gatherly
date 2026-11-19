import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { GatherlyEvent } from '../models/event.model';
import { OrganizationRegistration } from '../models/organization-dashboard.model';
import { GatherlyService } from '../models/service.model';
import { UserOrganizerProfile } from '../models/user-organizer.model';
import { AdminDataService } from './admin-data.service';

@Injectable({ providedIn: 'root' })
export class UserOrganizerDataService {
  private readonly adminData = inject(AdminDataService);
  private readonly profile: UserOrganizerProfile = {
    first_name: 'Rohan',
    last_name: 'Kapoor',
    email_id: 'rohan.organizer@example.com',
    phone_number: '+91 98765 41122',
    address: 'Indiranagar, Bengaluru',
    profile_pic: '/assets/images/logo/gatherly-mark.svg',
    bio: 'Community event organizer creating inclusive local opportunities.',
    interests: 'Volunteering, education, neighborhood wellness'
  };
  private readonly ownedEventIds = [301, 302];
  private readonly ownedServiceIds = [4, 5];

  getProfile(): Observable<UserOrganizerProfile> {
    return of({ ...this.profile }).pipe(delay(120));
  }

  updateProfile(profile: UserOrganizerProfile): Observable<UserOrganizerProfile> {
    Object.assign(this.profile, profile);
    return of({ ...this.profile }).pipe(delay(220));
  }

  getEvents(): Observable<GatherlyEvent[]> {
    return this.adminData.getEvents().pipe(
      map((events) => events.filter((event) => this.ownedEventIds.includes(event.id)))
    );
  }

  getServices(): Observable<GatherlyService[]> {
    return this.adminData.getServices().pipe(
      map((services) => services.filter((service) => this.ownedServiceIds.includes(service.id)))
    );
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
