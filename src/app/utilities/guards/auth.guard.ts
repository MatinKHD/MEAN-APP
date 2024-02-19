import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.user$.pipe(
    map(({ authStatus }) => {
      authStatus ? false : true;
      if (!authStatus) {
        router.navigate(['auth/login']);
        return false;
      }
      return true;
    })
  );
};
