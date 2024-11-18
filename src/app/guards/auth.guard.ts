import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);  // Inyectamos el servicio Router

  const storedUser = localStorage.getItem('currentUser');
  
  if (storedUser) {
    return true;  // Permitir acceso si el usuario está autenticado
  } else {
    router.navigate(['/login']);  // Redirigir al login si no está autenticado
    return false;
  }
};
