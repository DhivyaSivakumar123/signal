import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../../shared/components/toast/toast.service';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && req.url.startsWith(environment.apiUrl)) {
        if (error.status === 401) return throwError(() => error);

        if (error.status === 0 || error.status === 504) {
          toastService.error('Network error — please check your connection and try again.', true);
        } else if (error.status === 503 || error.status === 502) {
          toastService.error('Backend is temporarily unavailable. Please try again shortly.', true);
        } else if (error.status === 422) {
          const message = error.error?.error?.message ?? 'Validation failed. Please correct the highlighted fields.';
          toastService.error(message);
        } else if (error.status === 400) {
          const message = error.error?.error?.message ?? 'Invalid request. Please try again.';
          toastService.error(message);
        } else if (error.status >= 500) {
          toastService.error('Server error — please try again.', true);
        } else {
          toastService.error(error.message ?? 'A network error occurred');
        }
      }
      return throwError(() => error);
    })
  );
};
