import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState, UserService } from '../services/user.service';
import { APP_PATHS } from '../../shared/models/app-paths.model';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "../services/auth.service";
import { PageLoaderService } from "../components/page-loader/page-loader.service";

export const guestGuard = async () => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const pageLoaderService = inject(PageLoaderService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  if (userService.authState() === AuthState.Unknown) {
    pageLoaderService.show();
    try {
      await authService.initializeAuth();
    } finally {
      pageLoaderService.hide();
    }
  }

  if (userService.authState() === AuthState.Authenticated) {
    snackBar.open('Already logged in', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['bg-red-500', 'text-white']
    });
    return router.createUrlTree([APP_PATHS.HOME]);
  }

  return true;
};
