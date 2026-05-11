import { inject, Injectable } from "@angular/core";
import { UserService } from "./user.service";
import {
  AuthControllerAuthService,
  AuthResponse,
  ExchangeTempLoginTokenRequest,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  UserResponse
} from "../../../openApi/auth";
import { catchError, firstValueFrom, from, of, switchMap, tap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { APP_PATHS } from "../../shared/models/app-paths.model";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PreferencesProfileService } from "../../../openApi/profile";
import { LanguageService } from "./language.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userService = inject(UserService);
  private readonly authControllerAuthService = inject(AuthControllerAuthService);
  private readonly preferencesService = inject(PreferencesProfileService);
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  exchangeTempLoginToken(token: string) {
    const exchangeTempLoginTokenRequest: ExchangeTempLoginTokenRequest = { token };
    return this.authControllerAuthService.exchangeTempLoginToken(exchangeTempLoginTokenRequest)
      .pipe(
        switchMap(authRes => {
          return from(this.handleAuthResponse(authRes)).pipe(switchMap(() => of(authRes)));
        })
      );
  }

  register(email: string, password: string) {
    const registerRequest: RegisterRequest = { email, password };
    return this.authControllerAuthService.register(registerRequest)
      .pipe(
        switchMap(authRes => {
          return from(this.handleAuthResponse(authRes)).pipe(switchMap(() => of(authRes)));
        })
      );
  }

  login(email: string, password: string) {
    const loginRequest: LoginRequest = { email: email, password: password };
    return this.authControllerAuthService.login(loginRequest)
      .pipe(
        switchMap(authRes => {
          return from(this.handleAuthResponse(authRes)).pipe(switchMap(() => of(authRes)));
        })
      );
  }

  logout(redirectPath: string = APP_PATHS.HOME) {
    return this.authControllerAuthService.logout()
      .pipe(
        tap(() => this.clearSessionState(redirectPath)),
        catchError((err) => {
          this.clearSessionState(redirectPath);
          return throwError(() => err);
        })
      );
  }

  clearSessionState(redirectPath: string = APP_PATHS.HOME) {
    this.userService.logout();
    this.router.navigate([redirectPath]);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  showSessionExpiredToast() {
    this.snackBar.open('Session timed out. Please log in again.', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['bg-red-500', 'text-white']
    });
  }

  refreshToken(refreshToken: string) {
    const refreshRequest: RefreshRequest = { refreshToken: refreshToken };
    return this.authControllerAuthService.refresh(refreshRequest).pipe(
      switchMap(authRes => {
        return from(this.handleAuthResponse(authRes)).pipe(switchMap(() => of(authRes)));
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  async initializeAuth(): Promise<void> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return;
    }

    try {
      const user: UserResponse = await firstValueFrom(this.authControllerAuthService.me());
      await this.handleUserAndPreferences(user);
    } catch (error) {
      // If error is 401, the interceptor handles the refresh flow.
      // If it reaches here with 401, it means the refresh failed and interceptor already handled logout.
      // If it's another error (like 403 or server down), we log it.
      if (error instanceof HttpErrorResponse && error.status !== 401) {
        console.error('Error fetching user info', error);
      }
    }
  }

  async handleAuthResponse(authRes: AuthResponse) {
    localStorage.setItem('access_token', authRes.accessToken);
    localStorage.setItem('refresh_token', authRes.refreshToken);
    await this.handleUserAndPreferences(authRes.user);
  }

  private async handleUserAndPreferences(user: UserResponse) {
    await this.userService.setLoggedInUser(user);
    try {
      const preferences = await firstValueFrom(this.preferencesService.getUserPreferences());
      if (preferences) {
        this.userService.setUserPreferences(preferences);
        const storedLocale = localStorage.getItem('user_locale');
        if (preferences.locale && preferences.locale !== storedLocale) {
          this.languageService.setLanguage(preferences.locale);
        }
      }
    } catch (e) {
      console.log('Failed to fetch user preferences (could be empty)', e);
    }
  }
}
