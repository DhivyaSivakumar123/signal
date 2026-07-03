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
        if (error.status !== 401) {
          if (error.status === 400 || error.status === 422) {
            const message = error.error?.error?.message ?? 'Something went wrong';
            toastService.error(message);
          } else if (error.status === 500) {
            toastService.error('Server error — please try again');
          } else {
            toastService.error(error.message ?? 'A network error occurred');
          }
        }
      }
      return throwError(() => error);
    })
  );
};
