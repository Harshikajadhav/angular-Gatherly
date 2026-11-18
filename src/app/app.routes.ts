import { Routes } from '@angular/router';

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
  { path: '**', redirectTo: 'login' }
];
