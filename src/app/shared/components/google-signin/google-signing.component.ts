import { Component, inject, OnDestroy, signal } from '@angular/core';
import { AppConfigService } from "../../../core/services/app-config.service";
import { AuthService } from "../../../core/services/auth.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatIconButton } from "@angular/material/button";
import { Router } from "@angular/router";
import { APP_PATHS } from "../../models/app-paths.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-google-signin',
  standalone: true,
  imports: [MatSnackBarModule, MatIconButton],
  template: `
    <button (click)="onGoogleLoginClick()" [disabled]="isDisabled()" type="button" matIconButton>
      <svg height="18" viewBox="0 0 48 48" width="18" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
          fill="#4285F4"/>
        <path
          d="M6.3 14.7l6.6 4.8C14.6 15.8 19 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.5 2 9.9 5.8 6.3 11.6z"
          fill="#EA4335"/>
        <path
          d="M24 46c5.9 0 11.2-2.4 15-6.1l-6.1-5.1c-2.4 1.7-5.4 2.7-8.9 2.7-5.1 0-9.6-3.2-11.4-7.8l-7.3 5.6C9.1 40.8 16.1 46 24 46z"
          fill="#34A853"/>
        <path d="M4.6 30.3c-.4-1.3-.6-2.7-.6-4.3s.2-3 .6-4.3l-7.3-5.6C3.1 19.3 2 22.5 2 26s1.1 6.7 3.3 9.9l7.3-5.6z"
              fill="#FBBC05"/>
      </svg>
    </button>
  `,
})
export class GoogleSigningComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly appConfig = inject(AppConfigService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  protected readonly isDisabled = signal(false);
  private authSubscription?: Subscription;
  private messageListener?: (event: MessageEvent) => void;

  onGoogleLoginClick() {
    this.isDisabled.set(true);

    const width = 500;
    const height = 600;
    const left = globalThis.screen.width / 2 - width / 2;
    const top = globalThis.screen.height / 2 - height / 2;

    const url = `${this.appConfig.get('NG_APP_AUTH_API_URL')}/oauth2/authorization/google`;
    const popup = globalThis.open(
      url,
      'google-login',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup) {
      this.isDisabled.set(false);
      this.snackBar.open('The Google Sign-In popup failed to open. Please check your browser settings.', 'Close', {
        duration: 5000,
        panelClass: ['bg-red-500', 'text-white']
      });
      return;
    }

    this.messageListener = (event: MessageEvent) => {
      if (event.origin !== globalThis.location.origin) return;

      if (event.data.type === 'OAUTH2_TOKEN') {
        const token = event.data.token;
        popup.close();
        this.handleTempLoginTokenExchange(token);
        this.cleanupListener();
      }
    };

    globalThis.addEventListener('message', this.messageListener);

    const pollTimer = globalThis.setInterval(() => {
      if (popup.closed) {
        globalThis.clearInterval(pollTimer);
        this.isDisabled.set(false);
        this.cleanupListener();
      }
    }, 500);
  }

  ngOnDestroy() {
    this.cleanupListener();
    this.authSubscription?.unsubscribe();
  }

  private handleTempLoginTokenExchange(token: string) {
    this.authSubscription = this.authService.exchangeTempLoginToken(token).subscribe({
      next: () => {
        this.router.navigate([APP_PATHS.HOME], { replaceUrl: true });
      },
      error: (err) => {
        console.error('Exchange code failed', err);
        this.isDisabled.set(false);
        this.snackBar.open('Authentication failed. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  private cleanupListener() {
    if (this.messageListener) {
      globalThis.removeEventListener('message', this.messageListener);
      this.messageListener = undefined;
    }
  }
}
