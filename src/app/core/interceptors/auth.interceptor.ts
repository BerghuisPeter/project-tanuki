import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { APP_PATHS } from '../../shared/models/app-paths.model';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/assets/')) {
    return next(req);
  }
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // If we have a token, and it's not a login/register/refresh request, add the Authorization header
  let authReq = req;
  const isAuthRequest = req.url.includes('/api/v1/auth/login') ||
    req.url.includes('/api/v1/auth/register') ||
    req.url.includes('/api/v1/auth/refresh') ||
    req.url.includes('/api/v1/auth/google') ||
    req.url.includes('/api/v1/auth/oauth2');

  if (token && !isAuthRequest) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  if (req.headers.has('Content-Type') && req.headers.get('Content-Type') === 'application/json') {
    authReq = authReq.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      // Check for 401 error and make sure it's not from a refresh request itself
      const isRefreshRequest = req.url.includes('/api/v1/auth/refresh');
      const isLoginRequest = req.url.includes('/api/v1/auth/login');

      if (error instanceof HttpErrorResponse && error.status === 401 && !isRefreshRequest && !isLoginRequest) {
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<unknown>> {
  if (isRefreshing) {
    // If we're already refreshing, wait for the new token
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next(req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })))
    );
  } else {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = authService.getRefreshToken();

    if (refreshToken) {
      return authService.refreshToken(refreshToken).pipe(
        switchMap((authRes) => {
          isRefreshing = false;
          refreshTokenSubject.next(authRes.accessToken);

          // Retry the original request with the new access token
          return next(req.clone({
            setHeaders: {
              Authorization: `Bearer ${authRes.accessToken}`
            }
          }));
        }),
        catchError((err) => {
          isRefreshing = false;
          // If refresh fails, the session is already invalid on the backend.
          // We just need to clear local state and redirect to login.
          authService.clearSessionState(APP_PATHS.AUTHENTICATION);
          authService.showSessionExpiredToast();
          return throwError(() => err);
        })
      );
    } else {
      isRefreshing = false;
      // No refresh token available, clear state and redirect
      authService.clearSessionState(APP_PATHS.AUTHENTICATION);
      authService.showSessionExpiredToast();
      return throwError(() => new Error('No refresh token available'));
    }
  }
}
