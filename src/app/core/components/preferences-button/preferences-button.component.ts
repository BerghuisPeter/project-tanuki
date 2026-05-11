import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { Router } from "@angular/router";
import { APP_PATHS } from "../../../shared/models/app-paths.model";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-preferences-button",
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (userService.isLoggedIn()) {
      @if (isMenuItem()) {
        <button (click)="toPreferences()" class="flex items-center" mat-menu-item>
          <mat-icon class="mr-1">settings</mat-icon>
          <span i18n="@@core.preferences-button.label">Preferences</span>
        </button>
      } @else {
        <button (click)="toPreferences()" class="flex items-center" mat-button>
          <mat-icon class="mr-1">settings</mat-icon>
          <span i18n="@@core.preferences-button.label">Preferences</span>
        </button>
      }
    }
  `,
})
export class PreferencesButtonComponent {
  public readonly isMenuItem = input<boolean>(false);
  public readonly userService = inject(UserService);
  private readonly router = inject(Router);

  toPreferences(): void {
    this.router.navigate([APP_PATHS.PREFERENCES]);
  }
}
