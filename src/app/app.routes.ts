import { Routes } from '@angular/router';
import { APP_PATHS } from "./shared/models/app-paths.model";
import { PageNotFoundComponent } from "./core/components/page-not-found/page-not-found.component";
import { guestGuard } from "./core/guards/guest.guard";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: APP_PATHS.CHAT,
    loadComponent: () => import('./features/global-chat/global-chat.component').then(m => m.GlobalChatComponent)
  },
  {
    path: APP_PATHS.AUTHENTICATION,
    canActivate: [guestGuard],
    loadComponent: () => import('./features/authentication/authentication.component').then(m => m.AuthenticationComponent)
  },
  {
    path: APP_PATHS.PROFILE,
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: APP_PATHS.GOSHUIN,
    loadComponent: () => import('./features/goshuin/goshuin').then(m => m.GoshuinComponent)
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
