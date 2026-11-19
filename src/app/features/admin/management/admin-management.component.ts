import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminOrganization, AdminReport, AdminUser } from '../../../core/models/admin.model';
import { GatherlyEvent } from '../../../core/models/event.model';
import { GatherlyService } from '../../../core/models/service.model';
import { AdminDataService } from '../../../core/services/admin-data.service';

type ManagementKind = 'users' | 'organizations' | 'events' | 'services' | 'reports';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-management.component.html',
  styleUrl: './admin-management.component.css'
})
export class AdminManagementComponent implements OnInit {
  private readonly adminData = inject(AdminDataService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  kind: ManagementKind = 'users';
  searchText = '';
  role = '';
  status = '';
  category = '';
  users: AdminUser[] = [];
  organizations: AdminOrganization[] = [];
  events: GatherlyEvent[] = [];
  services: GatherlyService[] = [];
  reports: AdminReport[] = [];
  selectedReport?: AdminReport;
  page = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.kind = (this.route.snapshot.data['kind'] || 'users') as ManagementKind;
    if (this.kind === 'users') this.adminData.getUsers().subscribe((data) => this.users = data);
    if (this.kind === 'organizations') this.adminData.getOrganizations().subscribe((data) => this.organizations = data);
    if (this.kind === 'events') this.adminData.getEvents().subscribe((data) => this.events = data);
    if (this.kind === 'services') this.adminData.getServices().subscribe((data) => this.services = data);
    if (this.kind === 'reports') this.adminData.getReports().subscribe((data) => this.reports = data);
  }

  get title(): string {
    return { users: 'User Management', organizations: 'Organization Management', events: 'Event Management', services: 'Service Management', reports: 'Reports & Complaints' }[this.kind];
  }

  get subtitle(): string {
    return { users: 'Inspect accounts and manage platform access.', organizations: 'Review registered organizations and their status.', events: 'Monitor events created across Gatherly.', services: 'Review service listings submitted by organizations.', reports: 'Review and resolve reports submitted by the community.' }[this.kind];
  }

  get filteredUsers(): AdminUser[] {
    return this.users.filter((user) => this.matches(`${user.first_name} ${user.last_name} ${user.email_id}`) && (!this.role || user.role === this.role) && (!this.status || user.account_status === this.status));
  }
  get filteredOrganizations(): AdminOrganization[] {
    return this.organizations.filter((organization) => this.matches(`${organization.organization_name} ${organization.email_id} ${organization.registration_number}`) && (!this.status || organization.verification_status === this.status));
  }
  get filteredEvents(): GatherlyEvent[] { return this.events.filter((event) => this.matches(`${event.title} ${event.organization.organization_name} ${event.location}`) && (!this.category || event.category === this.category)); }
  get filteredServices(): GatherlyService[] { return this.services.filter((service) => this.matches(`${service.service_name} ${service.organization.organization_name}`) && (!this.category || service.category === this.category)); }
  get filteredReports(): AdminReport[] { return this.reports.filter((report) => this.matches(`${report.subject} ${report.submitted_by} ${report.category}`) && (!this.status || report.status === this.status)); }
  get categories(): string[] { return [...new Set([...this.events.map((event) => event.category), ...this.services.map((service) => service.category)])].sort(); }
  get currentCount(): number { return this.kind === 'users' ? this.filteredUsers.length : this.kind === 'organizations' ? this.filteredOrganizations.length : this.kind === 'events' ? this.filteredEvents.length : this.kind === 'services' ? this.filteredServices.length : this.filteredReports.length; }

  matches(value: string): boolean { return !this.searchText || value.toLowerCase().includes(this.searchText.toLowerCase()); }
  resetPage(): void { this.page = 1; }
  openReport(report: AdminReport): void { this.selectedReport = report; }
  resolveReport(report: AdminReport): void { this.adminData.updateReportStatus(report.id, 'RESOLVED'); report.status = 'RESOLVED'; this.selectedReport = undefined; }
  viewOrganization(id: number): void { void this.router.navigate(['/admin/organizations', id]); }
}
