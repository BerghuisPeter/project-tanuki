import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { APP_PATHS } from '../../shared/models/app-paths.model';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip logic for assets
  if (req.url.includes('/assets/')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // Define endpoints that don't need the Bearer token or 401 refresh handling
  const authEndpoints = ['/login', '/register', '/refresh'];
  const isAuthRequest = authEndpoints.some(path => req.url.includes(path));

  // 1. Prepare Headers (Combine clones for efficiency)
  const headers: Record<string, string> = {};

  if (token && !isAuthRequest) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Preserve charset for application/json requests
  if (req.headers.get('Content-Type') === 'application/json') {
    headers['Content-Type'] = 'application/json; charset=utf-8';
  }

  const authReq = Object.keys(headers).length > 0
    ? req.clone({ setHeaders: headers })
    : req;

  // 2. Handle Request
  return next(authReq).pipe(
    catchError((error) => {
      // Check for 401 and ensure it's not an auth request (to avoid infinite loops)
      if (error instanceof HttpErrorResponse && error.status === 401 && !isAuthRequest) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<unknown>> {
  // Access state from AuthService instead of global variables
  if (authService.isRefreshing()) {
    return authService.refreshToken$.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next(req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })))
    );
  } else {
    authService.setRefreshing(true);
    const refreshToken = authService.getRefreshToken();

    if (!refreshToken) {
      authService.setRefreshing(false);
      authService.clearSessionState(APP_PATHS.AUTHENTICATION);
      authService.showSessionExpiredToast();
      return throwError(() => new Error('No refresh token available'));
    }

    return authService.refreshToken(refreshToken).pipe(
      switchMap((authRes) => {
        authService.setRefreshing(false);
        authService.notifyRefreshSuccess(authRes.accessToken);

        // Retry the original request with the new access token
        return next(req.clone({
          setHeaders: { Authorization: `Bearer ${authRes.accessToken}` }
        }));
      }),
      catchError((err) => {
        authService.setRefreshing(false);
        authService.notifyRefreshFailure(err);
        authService.clearSessionState(APP_PATHS.AUTHENTICATION);
        authService.showSessionExpiredToast();
        return throwError(() => err);
      })
    );
  }
}
