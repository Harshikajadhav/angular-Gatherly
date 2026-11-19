import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (module) => module.LoginComponent
      )
  },
  {
    path: 'organization-registration',
    loadComponent: () =>
      import('./features/auth/organization-registration/organization-registration.component').then(
        (module) => module.OrganizationRegistrationComponent
      )
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/citizen-registration/citizen-registration.component').then(
        (module) => module.CitizenRegistrationComponent
      )
  },
  {
    path: 'discover-services',
    loadComponent: () =>
      import('./features/citizen/explore/discover-services.component').then(
        (module) => module.DiscoverServicesComponent
      )
  },
  {
    path: 'discover-services/:category',
    loadComponent: () =>
      import('./features/citizen/explore/category-events.component').then(
        (module) => module.CategoryEventsComponent
      )
  },
  {
    path: 'events/:eventId',
    loadComponent: () =>
      import('./features/citizen/explore/event-details.component').then(
        (module) => module.EventDetailsComponent
      )
  },
  {
    path: 'citizen',
    canActivate: [authGuard, roleGuard],
    data: { role: 'citizen' },
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then(
        (module) => module.DashboardLayoutComponent
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/citizen/dashboard/dashboard.component').then(
            (module) => module.CitizenDashboardComponent
          )
      },
      {
        path: 'discover-services',
        data: { portal: 'citizen' },
        loadComponent: () =>
          import('./features/citizen/explore/discover-services.component').then(
            (module) => module.DiscoverServicesComponent
          )
      },
      {
        path: 'discover-services/:category',
        data: { portal: 'citizen' },
        loadComponent: () =>
          import('./features/citizen/explore/category-events.component').then(
            (module) => module.CategoryEventsComponent
          )
      },
      {
        path: 'discover-events',
        loadComponent: () =>
          import('./features/citizen/events/discover-events.component').then(
            (module) => module.CitizenDiscoverEventsComponent
          )
      },
      {
        path: 'events/:eventId',
        data: { portal: 'citizen' },
        loadComponent: () =>
          import('./features/citizen/explore/event-details.component').then(
            (module) => module.EventDetailsComponent
          )
      },
      {
        path: 'my-events',
        loadComponent: () =>
          import('./features/citizen/my-events/my-events.component').then(
            (module) => module.CitizenMyEventsComponent
          )
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/citizen/profile/profile.component').then(
            (module) => module.CitizenProfileComponent
          )
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/citizen/settings/settings.component').then(
            (module) => module.CitizenSettingsComponent
          )
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then(
        (module) => module.DashboardLayoutComponent
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (module) => module.AdminDashboardComponent
          )
      },
      {
        path: 'users',
        data: { kind: 'users' },
        loadComponent: () =>
          import('./features/admin/management/admin-management.component').then(
            (module) => module.AdminManagementComponent
          )
      },
      {
        path: 'organizations',
        data: { kind: 'organizations' },
        loadComponent: () =>
          import('./features/admin/management/admin-management.component').then(
            (module) => module.AdminManagementComponent
          )
      },
      {
        path: 'organizations/:id',
        data: { kind: 'organizations' },
        loadComponent: () =>
          import('./features/admin/management/admin-management.component').then(
            (module) => module.AdminManagementComponent
          )
      },
      {
        path: 'organization-verification',
        loadComponent: () =>
          import('./features/admin/verification/organization-verification.component').then(
            (module) => module.OrganizationVerificationComponent
          )
      },
      {
        path: 'organization-verification/:id',
        loadComponent: () =>
          import('./features/admin/verification/organization-verification.component').then(
            (module) => module.OrganizationVerificationComponent
          )
      },
      {
        path: 'events',
        data: { kind: 'events' },
        loadComponent: () =>
          import('./features/admin/management/admin-management.component').then(
            (module) => module.AdminManagementComponent
          )
      },
      {
        path: 'services',
        data: { kind: 'services' },
        loadComponent: () =>
          import('./features/admin/management/admin-management.component').then(
            (module) => module.AdminManagementComponent
          )
      },
      {
        path: 'reports',
        data: { kind: 'reports' },
        loadComponent: () =>
          import('./features/admin/management/admin-management.component').then(
            (module) => module.AdminManagementComponent
          )
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/citizen/profile/profile.component').then(
            (module) => module.CitizenProfileComponent
          )
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/citizen/settings/settings.component').then(
            (module) => module.CitizenSettingsComponent
          )
      }
    ]
  },
  {
    path: 'organization',
    canActivate: [authGuard, roleGuard],
    data: { role: 'organization' },
    loadComponent: () =>
      import('./layouts/dashboard-layout/dashboard-layout.component').then(
        (module) => module.DashboardLayoutComponent
      ),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/organization/dashboard/dashboard.component').then(
            (module) => module.OrganizationDashboardComponent
          )
      },
      {
        path: 'my-organization',
        data: { kind: 'organization' },
        loadComponent: () =>
          import('./features/organization/management/organization-management.component').then(
            (module) => module.OrganizationManagementComponent
          )
      },
      {
        path: 'my-services',
        data: { kind: 'services' },
        loadComponent: () =>
          import('./features/organization/management/organization-management.component').then(
            (module) => module.OrganizationManagementComponent
          )
      },
      {
        path: 'my-events',
        data: { kind: 'events' },
        loadComponent: () =>
          import('./features/organization/management/organization-management.component').then(
            (module) => module.OrganizationManagementComponent
          )
      },
      {
        path: 'create-event',
        loadComponent: () =>
          import('./features/organization/events/create-event.component').then(
            (module) => module.OrganizationCreateEventComponent
          )
      },
      {
        path: 'event-participants',
        data: { kind: 'participants' },
        loadComponent: () =>
          import('./features/organization/management/organization-management.component').then(
            (module) => module.OrganizationManagementComponent
          )
      },
      {
        path: 'profile',
        data: { role: 'organization' },
        loadComponent: () =>
          import('./features/citizen/profile/profile.component').then(
            (module) => module.CitizenProfileComponent
          )
      },
      {
        path: 'settings',
        data: { role: 'organization' },
        loadComponent: () =>
          import('./features/citizen/settings/settings.component').then(
            (module) => module.CitizenSettingsComponent
          )
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
