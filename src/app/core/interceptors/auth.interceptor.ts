import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../state/auth/auth.actions';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const store = inject(Store);

  const token = authService.getAccessToken();
  let authReq = req;

  // Only attach header to requests going to our backend API URL
  if (token && req.url.startsWith(environment.apiUrl)) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && req.url.startsWith(environment.apiUrl)) {
        // Avoid infinite loop if refresh or callback itself fails
        if (req.url.includes('/api/auth/refresh') || req.url.includes('/api/auth/callback')) {
          authService.clearTokens();
          store.dispatch(AuthActions.logoutSuccess());
          router.navigate(['/login']);
          return throwError(() => error);
        }

        const refreshToken = authService.getRefreshToken();
        if (refreshToken) {
          return authService.refreshToken(refreshToken).pipe(
            switchMap((tokens) => {
              authService.storeTokens(tokens);
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${tokens.accessToken}` }
              });
              return next(retryReq);
            }),
            catchError((refreshErr) => {
              authService.clearTokens();
              store.dispatch(AuthActions.logoutSuccess());
              router.navigate(['/login']);
              return throwError(() => refreshErr);
            })
          );
        } else {
          authService.clearTokens();
          store.dispatch(AuthActions.logoutSuccess());
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
