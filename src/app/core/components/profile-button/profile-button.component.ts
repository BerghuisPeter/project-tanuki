import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { Router } from "@angular/router";
import { APP_PATHS } from "src/app/shared/models/app-paths.model";
import { UserService } from "../../services/user.service";
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: "app-profile-button",
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule, TranslocoModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *transloco="let t">
      @if (userService.isReady()) {
        @if (userService.isLoggedIn()) {
          @if (isMenuItem()) {
            <button (click)="toProfile()" class="flex items-center" mat-menu-item>
              <mat-icon class="mr-1">person</mat-icon>
              <span>{{ t('profile.button.open') }}</span>
            </button>
          } @else {
            <button (click)="toProfile()" class="flex items-center" mat-button>
              <mat-icon class="mr-1">person</mat-icon>
              <span>{{ t('profile.button.open') }}</span>
            </button>
          }
        }
      } @else {
        @if (isMenuItem()) {
          <button mat-menu-item disabled class="flex items-center">
            <mat-icon class="mr-1 opacity-20 animate-pulse">settings</mat-icon>
            <span class="w-24 h-4 bg-black/10 dark:bg-white/10 rounded animate-pulse"></span>
          </button>
        } @else {
          <button mat-button disabled class="flex items-center">
            <mat-icon class="mr-1 opacity-20 animate-pulse">settings</mat-icon>
            <span class="w-24 h-4 bg-black/10 dark:bg-white/10 rounded animate-pulse"></span>
          </button>
        }
      }
    </ng-container>
  `,
})
export class ProfileButtonComponent {
  public readonly isMenuItem = input<boolean>(false);
  public readonly userService = inject(UserService);
  private readonly router = inject(Router);

  toProfile(): void {
    this.router.navigate([APP_PATHS.PROFILE]);
  }
}
