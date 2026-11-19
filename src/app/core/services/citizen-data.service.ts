import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { CitizenProfile, RegistrationStatus } from '../models/dashboard.model';
import { GatherlyEvent } from '../models/event.model';
import { EventDiscoveryService } from './event-discovery.service';

export interface RegisteredEvent {
  event: GatherlyEvent;
  status: RegistrationStatus;
}

@Injectable({ providedIn: 'root' })
export class CitizenDataService {
  private readonly profile: CitizenProfile = {
    first_name: 'Aarav',
    last_name: 'Sharma',
    email_id: 'aarav.sharma@example.com',
    phone_number: '+91 98765 40000',
    address: 'Indiranagar, Bengaluru',
    profile_pic: '/assets/images/logo/gatherly-mark.svg'
  };

  constructor(private readonly eventService: EventDiscoveryService) {}

  getProfile(): Observable<CitizenProfile> {
    return of({ ...this.profile }).pipe(delay(150));
  }

  updateProfile(profile: CitizenProfile): Observable<CitizenProfile> {
    Object.assign(this.profile, profile);
    return of({ ...this.profile }).pipe(delay(250));
  }

  getRegisteredEvents(): Observable<RegisteredEvent[]> {
    return this.eventService.getEvents().pipe(
      // These IDs represent the current citizen's mock registrations.
      // The API integration can replace this selection with the user's registrations.
      map((events) => events
        .filter((event) => [101, 202, 301].includes(event.id))
        .map((event) => ({
          event,
          status: event.id === 301 ? 'COMPLETED' as const : 'REGISTERED' as const
        })))
    );
  }
}
