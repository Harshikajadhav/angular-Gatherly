import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DashboardNavItem } from '../../core/models/dashboard.model';
import { DashboardHeaderComponent } from '../../shared/components/dashboard-header/dashboard-header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, DashboardHeaderComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {
  readonly citizenNavItems: DashboardNavItem[] = [
    { label: 'Dashboard', route: '/citizen/dashboard', icon: 'dashboard' },
    { label: 'Discover Services', route: '/citizen/discover-services', icon: 'services' },
    { label: 'Discover Events', route: '/citizen/discover-events', icon: 'events' },
    { label: 'Event Details', route: '/citizen/events/101', icon: 'detail' },
    { label: 'My Events', route: '/citizen/my-events', icon: 'calendar' },
    { label: 'My Profile', route: '/citizen/profile', icon: 'profile' },
    { label: 'Settings', route: '/citizen/settings', icon: 'settings' }
  ];
  readonly adminNavItems: DashboardNavItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
    { label: 'User Management', route: '/admin/users', icon: 'profile' },
    { label: 'Organization Management', route: '/admin/organizations', icon: 'organization' },
    { label: 'Organization Verification', route: '/admin/organization-verification', icon: 'verification' },
    { label: 'Event Management', route: '/admin/events', icon: 'events' },
    { label: 'Service Management', route: '/admin/services', icon: 'services' },
    { label: 'Reports & Complaints', route: '/admin/reports', icon: 'reports' },
    { label: 'My Profile', route: '/admin/profile', icon: 'profile' },
    { label: 'Settings', route: '/admin/settings', icon: 'settings' }
  ];
  readonly organizationNavItems: DashboardNavItem[] = [
    { label: 'Dashboard', route: '/organization/dashboard', icon: 'dashboard' },
    { label: 'My Organization', route: '/organization/my-organization', icon: 'organization' },
    { label: 'My Services', route: '/organization/my-services', icon: 'services' },
    { label: 'My Events', route: '/organization/my-events', icon: 'events' },
    { label: 'Create Event', route: '/organization/create-event', icon: 'calendar' },
    { label: 'Event Participants', route: '/organization/event-participants', icon: 'profile' },
    { label: 'My Profile', route: '/organization/profile', icon: 'profile' },
    { label: 'Settings', route: '/organization/settings', icon: 'settings' }
  ];
  pageTitle = 'Dashboard';
  sidebarOpen = false;
  userName = 'Aarav Sharma';
  profilePic = '/assets/images/logo/gatherly-mark.svg';
  isAdmin = false;
  isOrganization = false;

  constructor(private readonly router: Router) {
    this.isAdmin = this.router.url.startsWith('/admin');
    this.isOrganization = this.router.url.startsWith('/organization');
    this.userName = this.isAdmin ? 'Priya Menon' : this.isOrganization ? 'CareBridge Foundation' : 'Aarav Sharma';
    this.updateTitle(this.router.url);
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.updateTitle((event as NavigationEnd).urlAfterRedirects);
      this.sidebarOpen = false;
    });
  }

  get navItems(): DashboardNavItem[] {
    return this.isAdmin ? this.adminNavItems : this.isOrganization ? this.organizationNavItems : this.citizenNavItems;
  }

  get portalLabel(): string {
    return this.isAdmin ? 'Admin Portal' : this.isOrganization ? 'Organization Portal' : 'Citizen Portal';
  }

  private updateTitle(url: string): void {
    const titles: Record<string, string> = {
      '/citizen/dashboard': 'Dashboard',
      '/citizen/discover-services': 'Discover Services',
      '/citizen/discover-events': 'Discover Events',
      '/citizen/my-events': 'My Events',
      '/citizen/profile': 'My Profile',
      '/citizen/settings': 'Settings'
    };
    const adminTitles: Record<string, string> = {
      '/admin/dashboard': 'Dashboard',
      '/admin/users': 'User Management',
      '/admin/organizations': 'Organization Management',
      '/admin/organization-verification': 'Organization Verification',
      '/admin/events': 'Event Management',
      '/admin/services': 'Service Management',
      '/admin/reports': 'Reports & Complaints',
      '/admin/profile': 'My Profile',
      '/admin/settings': 'Settings'
    };
    const organizationTitles: Record<string, string> = {
      '/organization/dashboard': 'Dashboard',
      '/organization/my-organization': 'My Organization',
      '/organization/my-services': 'My Services',
      '/organization/my-events': 'My Events',
      '/organization/create-event': 'Create Event',
      '/organization/event-participants': 'Event Participants',
      '/organization/profile': 'My Profile',
      '/organization/settings': 'Settings'
    };
    this.pageTitle = this.isAdmin
      ? adminTitles[url] || 'Admin Dashboard'
      : this.isOrganization
        ? organizationTitles[url] || 'Organization Dashboard'
      : titles[url] || (url.startsWith('/citizen/events/') ? 'Event Details' : 'Citizen Dashboard');
  }
}
