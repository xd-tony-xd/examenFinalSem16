import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/Auth.service';


export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data?.['roles'] || [];

  if (!authService.currentUserValue) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles.length === 0) {
    return true;
  }

  const hasRole = requiredRoles.includes(authService.currentUserValue.rol);
  
  if (!hasRole) {
    router.navigate(['/access-denied']);
    return false;
  }

  return true;
};