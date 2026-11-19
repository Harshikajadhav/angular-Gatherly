import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GatherlyEvent } from '../../../core/models/event.model';
import { GatherlyService } from '../../../core/models/service.model';
import { OrganizationDataService } from '../../../core/services/organization-data.service';
import { DashboardStatCardComponent } from '../../../shared/components/dashboard-stat-card/dashboard-stat-card.component';

@Component({
  selector: 'app-organization-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardStatCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class OrganizationDashboardComponent implements OnInit {
  private readonly data = inject(OrganizationDataService);
  organizationName = 'CareBridge Foundation';
  organization?: import('../../../core/models/admin.model').AdminOrganization;
  services: GatherlyService[] = [];
  events: GatherlyEvent[] = [];
  registrations: import('../../../core/models/organization-dashboard.model').OrganizationRegistration[] = [];

  ngOnInit(): void {
    this.data.getOrganization().subscribe((organization) => { this.organization = organization; this.organizationName = organization.organization_name; });
    this.data.getServices().subscribe((services) => this.services = services);
    this.data.getEvents().subscribe((events) => this.events = events);
    this.data.getRegistrations().subscribe((registrations) => this.registrations = registrations);
  }
}
