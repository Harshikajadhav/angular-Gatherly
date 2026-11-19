import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminActivity, AdminOrganization, AdminUser } from '../../../core/models/admin.model';
import { GatherlyEvent } from '../../../core/models/event.model';
import { AdminDataService } from '../../../core/services/admin-data.service';
import { DashboardStatCardComponent } from '../../../shared/components/dashboard-stat-card/dashboard-stat-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardStatCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminData = inject(AdminDataService);

  pendingOrganizations: AdminOrganization[] = [];
  organizations: AdminOrganization[] = [];
  users: AdminUser[] = [];
  events: GatherlyEvent[] = [];
  activities: AdminActivity[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.pendingOrganizations = this.adminData.getPendingOrganizations();
    this.adminData.getOrganizations().subscribe((organizations) => this.organizations = organizations);
    this.adminData.getUsers().subscribe((users) => this.users = users);
    this.adminData.getEvents().subscribe((events) => { this.events = events; this.isLoading = false; });
    this.adminData.getActivities().subscribe((activities) => this.activities = activities);
  }
}
