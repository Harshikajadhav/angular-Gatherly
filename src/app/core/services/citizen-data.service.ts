import { Injectable } from '@angular/core';
import { Observable, delay, map, of, throwError } from 'rxjs';
import { CitizenProfile, RegistrationStatus } from '../models/dashboard.model';
import { GatherlyEvent } from '../models/event.model';
import { EventDiscoveryService } from './event-discovery.service';

export interface RegisteredEvent {
  event: GatherlyEvent;
  status: RegistrationStatus;
}
export interface VolunteeredEvent {
  event: GatherlyEvent;
  status: 'INTERESTED' | 'CONFIRMED';
}
export interface OrganizerApplication {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  documents: string[];
}
export interface IssueReport {
  eventId: number;
  description: string;
  imageName?: string;
  submittedAt: string;
}

@Injectable({ providedIn: 'root' })
export class CitizenDataService {
  private readonly registeredIds = new Set([101, 202, 301]);
  private organizerApplication?: OrganizerApplication;
  private readonly issueReports: IssueReport[] = [];
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
        .filter((event) => this.registeredIds.has(event.id))
        .map((event) => ({
          event,
          status: event.id === 301 ? 'COMPLETED' as const : 'REGISTERED' as const
        })))
    );
  }

  registerForEvent(eventId: number): Observable<RegisteredEvent> {
    if (this.registeredIds.has(eventId)) {
      return throwError(() => new Error('You are already registered for this event.'));
    }
    return this.eventService.getEvent(eventId).pipe(
      map((event) => {
        if (!event) throw new Error('This event is no longer available.');
        this.registeredIds.add(eventId);
        return { event, status: 'REGISTERED' as const };
      }),
      delay(250)
    );
  }

  getVolunteeredEvents(): Observable<VolunteeredEvent[]> {
    return this.eventService.getEvents().pipe(
      map((events) => events
        .filter((event) => [402].includes(event.id))
        .map((event) => ({ event, status: 'INTERESTED' as const })))
    );
  }

  getOrganizerApplication(): OrganizerApplication | undefined {
    return this.organizerApplication;
  }

  submitOrganizerApplication(documents: string[], consent: boolean): Observable<OrganizerApplication> {
    if (!consent) return throwError(() => new Error('Consent is required before submitting.'));
    if (this.organizerApplication?.status === 'PENDING') return throwError(() => new Error('Your organizer application is already pending review.'));
    this.organizerApplication = { status: 'PENDING', documents: [...documents] };
    return of({ ...this.organizerApplication }).pipe(delay(300));
  }

  submitIssueReport(eventId: number, description: string, imageName?: string): Observable<IssueReport> {
    if (this.issueReports.some((report) => report.eventId === eventId)) {
      return throwError(() => new Error('You have already submitted a report for this event.'));
    }
    if (!description.trim()) return throwError(() => new Error('Please describe the issue before submitting.'));
    const report: IssueReport = { eventId, description: description.trim(), imageName, submittedAt: new Date().toISOString() };
    this.issueReports.push(report);
    return of({ ...report }).pipe(delay(300));
  }
}
