import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GatherlyEvent } from '../../../core/models/event.model';
import { OrganizationRegistration } from '../../../core/models/organization-dashboard.model';
import { AdminDataService } from '../../../core/services/admin-data.service';
import { OrganizationDataService } from '../../../core/services/organization-data.service';
import { UserOrganizerDataService } from '../../../core/services/user-organizer-data.service';

@Component({
  selector: 'app-event-participants',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-participants.component.html',
  styleUrl: './event-participants.component.css'
})
export class EventParticipantsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly adminData = inject(AdminDataService);
  private readonly organizationData = inject(OrganizationDataService);
  private readonly organizerData = inject(UserOrganizerDataService);
  event?: GatherlyEvent;
  registrations: OrganizationRegistration[] = [];
  unavailable = false;

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    const source = location.pathname.startsWith('/organization')
      ? this.organizationData.getEvents()
      : location.pathname.startsWith('/user-organizer')
        ? this.organizerData.getEvents()
        : this.adminData.getEvents();
    source.subscribe((events) => {
      this.event = events.find((item) => item.id === eventId);
      if (!this.event) {
        this.unavailable = true;
        return;
      }
      const registrations = location.pathname.startsWith('/organization')
        ? this.organizationData.getRegistrations()
        : location.pathname.startsWith('/user-organizer')
          ? this.organizerData.getRegistrations()
          : this.adminData.getEventRegistrations(eventId);
      registrations.subscribe((items) => this.registrations = items.filter((item) => item.event.id === eventId));
    });
  }
}
