import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { APP_PATHS } from '../../shared/models/app-paths.model';
import { MatSnackBar } from "@angular/material/snack-bar";

export const authGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  if (!userService.isLoggedIn()) {
    snackBar.open('You must be logged in to access this page', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['bg-red-500', 'text-white']
    });
    return router.createUrlTree([APP_PATHS.AUTHENTICATION]);
  }

  return true;
};
