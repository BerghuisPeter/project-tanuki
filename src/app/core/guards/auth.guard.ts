import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState, UserService } from '../services/user.service';
import { APP_PATHS } from '../../shared/models/app-paths.model';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../services/auth.service";

export const authGuard = async () => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  if (userService.authState() === AuthState.Unknown) {
    await authService.initializeAuth();
  }

  if (userService.authState() === AuthState.Authenticated) {
    return true;
  }

  snackBar.open('You must be logged in to access this page', 'Close', {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ['bg-red-500', 'text-white']
  });
  return router.createUrlTree([APP_PATHS.AUTHENTICATION]);
};
