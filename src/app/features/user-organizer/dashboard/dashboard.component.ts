import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GatherlyEvent } from '../../../core/models/event.model';
import { GatherlyService } from '../../../core/models/service.model';
import { OrganizationRegistration } from '../../../core/models/organization-dashboard.model';
import { UserOrganizerDataService } from '../../../core/services/user-organizer-data.service';
import { DashboardStatCardComponent } from '../../../shared/components/dashboard-stat-card/dashboard-stat-card.component';

@Component({
  selector: 'app-user-organizer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardStatCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class UserOrganizerDashboardComponent implements OnInit {
  private readonly data = inject(UserOrganizerDataService);
  organizerName = 'Rohan Kapoor';
  events: GatherlyEvent[] = [];
  services: GatherlyService[] = [];
  registrations: OrganizationRegistration[] = [];

  ngOnInit(): void {
    this.data.getProfile().subscribe((profile) => this.organizerName = `${profile.first_name} ${profile.last_name}`);
    this.data.getEvents().subscribe((events) => this.events = events);
    this.data.getServices().subscribe((services) => this.services = services);
    this.data.getRegistrations().subscribe((registrations) => this.registrations = registrations);
  }
}
