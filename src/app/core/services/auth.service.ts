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
import { catchError, firstValueFrom, from, map, switchMap, tap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { APP_PATHS } from "../../shared/models/app-paths.model";
import { HttpErrorResponse } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ProfileProfileService, UserProfile } from "../../../openApi/profile";
import { LanguageService } from "./language.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly userService = inject(UserService);
  private readonly authControllerAuthService = inject(AuthControllerAuthService);
  private readonly profileService = inject(ProfileProfileService);
  private readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  private initPromise: Promise<void> | null = null;

  exchangeTempLoginToken(token: string) {
    const exchangeTempLoginTokenRequest: ExchangeTempLoginTokenRequest = { token };
    return this.authControllerAuthService.exchangeTempLoginToken(exchangeTempLoginTokenRequest)
      .pipe(
        switchMap(authRes => {
          return from(this.handleAuthResponse(authRes)).pipe(map(() => authRes));
        })
      );
  }

  register(email: string, password: string) {
    const registerRequest: RegisterRequest = { email, password };
    return this.authControllerAuthService.register(registerRequest)
      .pipe(
        switchMap(authRes => {
          return from(this.handleAuthResponse(authRes)).pipe(map(() => authRes));
        })
      );
  }

  login(email: string, password: string) {
    const loginRequest: LoginRequest = { email: email, password: password };
    return this.authControllerAuthService.login(loginRequest)
      .pipe(
        switchMap(authRes => {
          return from(this.handleAuthResponse(authRes)).pipe(map(() => authRes));
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
        return from(this.handleAuthResponse(authRes)).pipe(map(() => authRes));
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
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      const accessToken = this.getAccessToken();

      if (!accessToken) {
        this.userService.setUnauthenticated();
        return;
      }

      try {
        const user = await firstValueFrom(this.authControllerAuthService.me());
        await this.handleUserAndProfile(user);
      } catch (error) {
        this.userService.setUnauthenticated();
        if (error instanceof HttpErrorResponse && error.status !== 401) {
          console.error('Error fetching user info', error);
        }
      }
    })();

    return this.initPromise;
  }

  async handleAuthResponse(authRes: AuthResponse): Promise<void> {
    localStorage.setItem('access_token', authRes.accessToken);
    localStorage.setItem('refresh_token', authRes.refreshToken);
    await this.handleUserAndProfile(authRes.user);
  }

  private async handleUserAndProfile(user: UserResponse): Promise<void> {
    let userProfile: UserProfile | undefined;
    try {
      const profile = await firstValueFrom(this.profileService.getUserProfile());
      userProfile = profile ?? undefined;
    } catch (e) {
      console.log('Failed to fetch user profile (could be empty)', e);
    }

    this.userService.setLoggedInUser(user, userProfile);

    if (userProfile) {
      const storedLocale = localStorage.getItem('user_locale');
      if (userProfile.locale && userProfile.locale !== storedLocale) {
        this.languageService.setLanguage(userProfile.locale);
      }
    }
  }
}
