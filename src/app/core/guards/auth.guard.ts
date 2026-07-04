import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../state/auth/auth.actions';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  store.dispatch(AuthActions.loadCurrentUser());
  return true;
};
