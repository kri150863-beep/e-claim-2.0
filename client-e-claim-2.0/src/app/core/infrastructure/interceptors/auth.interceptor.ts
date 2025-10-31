import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let retry = false;

  // Helper method for token refresh logic
  const handleTokenRefresh = (
    authService: AuthService,
    req: HttpRequest<any>,
    next: any
  ): Observable<any> => {
    return authService.refreshToken().pipe(
      switchMap((refreshResponse) => {
        const newToken = refreshResponse?.data?.accessToken;

        if (!newToken) {
          throw new Error('No access token received');
        }

        // Retry the original request with the new token
        const retryReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`,
          },
        });

        return next.handle(retryReq);
      }),
      catchError((refreshError) => {
        console.warn('Token refresh failed, logging out user');
        // Logout without blocking on the logout request
        authService.logout().subscribe();
        return throwError(() => getErrorMessage(refreshError));
      })
    );
  };

  // Helper method to extract error message
  const getErrorMessage = (error: any): string => {
    if (typeof error?.error === 'string') {
      return error.error;
    }
    if (error?.body?.error) {
      return error.body.error;
    }
    if (error?.message) {
      return error.message;
    }
    if (error?.statusText) {
      return error.statusText;
    }
    return 'An unknown error occurred';
  };

  // Clone request and add auth header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  });

  return next(authReq).pipe(
    // Handle successful responses
    map((event: HttpEvent<any>): any => {
      if (event instanceof HttpResponse) {
        // return event.body;
      }
      return event;
    }),

    // Handle errors
    catchError((response: HttpErrorResponse) => {
      // Handle 401 Unauthorized
      if (response?.status === 401) {
        if (retry) {
          // If we've already retried, logout the user without blocking
          authService.logout().subscribe();
          return throwError(() => getErrorMessage(response));
        }

        return handleTokenRefresh(authService, req, next);
      }

      // Re-throw the error so calling code can handle it
      return throwError(() => getErrorMessage(response));
    })
  );
};
