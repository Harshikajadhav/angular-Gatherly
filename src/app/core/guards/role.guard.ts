import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const requiredRole = route.data['role'] as string | undefined;
  const activeRole = sessionStorage.getItem('gatherly-role');
  if (!requiredRole || !activeRole || activeRole === requiredRole) return true;
  return router.parseUrl(activeRole === 'admin' ? '/admin/dashboard' : '/citizen/dashboard');
};
