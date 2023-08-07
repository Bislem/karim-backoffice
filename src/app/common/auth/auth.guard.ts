import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem(inject(AuthService).JWT_TOKEN);
  const user = localStorage.getItem(inject(AuthService).USER_KEY);
  if (user && token) {
    return true;
  } else {
    return inject(Router).createUrlTree(['/auth/login']);
  }
};
