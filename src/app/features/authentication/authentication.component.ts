import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from "../../core/services/auth.service";
import { Router } from "@angular/router";
import { APP_PATHS } from "../../shared/models/app-paths.model";
import { GoogleSigningComponent } from "../../shared/components/google-signin/google-signing.component";
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    GoogleSigningComponent,
    TranslocoModule
  ],
  styleUrls: ['./authentication.component.scss'],
  templateUrl: './authentication.component.html',
})
export class AuthenticationComponent {
  isLoginMode = signal(true);
  isLoadingQuery = signal(false);
  authenticationError = signal<string | null>(null);

  private readonly fb = inject(FormBuilder);
  loginForm: FormGroup = this.fb.group({
    email: ['p@test.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['123456']
  });
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  toggleMode() {
    this.authenticationError.set(null);
    this.isLoginMode.update(v => !v);
    const confirmPassword = this.loginForm.get('confirmPassword');
    if (this.isLoginMode()) {
      confirmPassword?.clearValidators();
    } else {
      confirmPassword?.setValidators([this.samePasswordsValidator()]);
    }
    confirmPassword?.updateValueAndValidity();
  }

  samePasswordsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = this.loginForm?.get('password')?.value;
      const confirmPassword = control.value;

      if (password && confirmPassword && password !== confirmPassword) {
        return { samePasswords: true };
      }

      return null;
    };
  }

  onSubmit() {
    if (this.loginForm.valid) {
      if (this.isLoginMode()) {
        this.handleLogin();
      } else {
        this.handleRegister();
      }
    }
  }

  handleLogin() {
    this.isLoadingQuery.set(true);
    this.authenticationError.set(null);
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: () => {
        this.isLoadingQuery.set(false);
        this.router.navigate([APP_PATHS.HOME], { replaceUrl: true });
      },
      error: (err) => {
        this.isLoadingQuery.set(false);
        if (err.status === 401) {
          this.authenticationError.set(this.translocoService.translate('auth.error.invalidCredentials'));
        } else {
          this.authenticationError.set(this.translocoService.translate('auth.error.serverError'));
        }
      }
    });
  }

  handleRegister() {
    this.isLoadingQuery.set(true);
    this.authenticationError.set(null);
    this.authService.register(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: () => {
        this.isLoadingQuery.set(false);
        this.router.navigate([APP_PATHS.HOME], { replaceUrl: true });
      },
      error: (err) => {
        this.isLoadingQuery.set(false);
        if (err.status === 409) {
          this.authenticationError.set(this.translocoService.translate('auth.error.emailRegistered'));
        } else {
          this.authenticationError.set(this.translocoService.translate('auth.error.serverError'));
        }
      }
    });
  }
}
