import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export const authHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const auth_headers = inject(AuthService).getHeadersForInterceptors();
  const csrfToken = getCookie('csrftoken');
  
  const headers: any = { ...auth_headers };
  if (csrfToken && (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  if (Object.keys(headers).length > 0) {
    req = req.clone({
      setHeaders: headers,
    });
  }

  return next(req);
};

export const expiredSessionInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return next(req).pipe(
    catchError((error) => {
      if (
        error.status === 403 &&
        error.error?.detail === 'Authentication credentials were not provided.'
      ) {
        if (authService.isLoggedIn()) {
          authService.logout();
        }
        if (req.method === 'POST') {
          return throwError(
            () =>
              new HttpErrorResponse({
                status: 400,
                error: { detail: 'You login has expired, please login again.' },
              })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
