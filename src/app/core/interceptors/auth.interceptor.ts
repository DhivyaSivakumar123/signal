import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../state/auth/auth.actions';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

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
        if (!refreshToken) {
          authService.clearTokens();
          store.dispatch(AuthActions.logoutSuccess());
          router.navigate(['/login']);
          return throwError(() => error);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject.next(null);

          return authService.refreshToken(refreshToken).pipe(
            switchMap((tokens) => {
              isRefreshing = false;
              authService.storeTokens(tokens);
              refreshSubject.next(tokens.accessToken);
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${tokens.accessToken}` }
              });
              return next(retryReq);
            }),
            catchError((refreshErr) => {
              isRefreshing = false;
              refreshSubject.next(null);
              authService.clearTokens();
              store.dispatch(AuthActions.logoutSuccess());
              router.navigate(['/login']);
              return throwError(() => refreshErr);
            })
          );
        } else {
          return refreshSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((newToken) => {
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(retryReq);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
