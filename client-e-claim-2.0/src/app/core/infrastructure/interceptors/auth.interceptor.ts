import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Clone request and add auth header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authService.getToken()}`
    }
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
    catchError((response: any) => {
      // Handle 401 Unauthorized
      if (response?.status === 401) {
        // authService.logout();
        return authService.refreshToken().pipe(
          switchMap(response => {
            const newToken = response?.data?.accessToken;
            
            if (newToken) {
              // Retry the original request with the new token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(retryReq).pipe(
                catchError(response => {
                  authService.logout();
                  return throwError(() => (response?.body?.error || response));})
              )
            } else {
              authService.logout();
              return throwError(() => (response?.body?.error || response));
            }
          })
        );
      }
      
      // Re-throw the error so calling code can handle it
      return throwError(() => (response?.body?.error || response));
    })
  );
};