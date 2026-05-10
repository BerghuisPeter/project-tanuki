import { ChangeDetectionStrategy, Component, inject, input, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { APP_PATHS } from "../../../shared/models/app-paths.model";

@Component({
  selector: "app-auth-button",
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule],
  templateUrl: "./auth-button.component.html",
  styleUrl: "./auth-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthButtonComponent {

  public readonly isMenuItem = input<boolean>(false);

  protected readonly isLoggingOut = signal<boolean>(false);
  public readonly userService = inject(UserService);
  protected readonly APP_PATHS = APP_PATHS;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.isLoggingOut.set(true);
    this.authService.logout().subscribe({
      next: () => this.isLoggingOut.set(false),
      error: () => this.isLoggingOut.set(false),
    });
  }

  toLogin(): void {
    this.router.navigate([APP_PATHS.AUTHENTICATION]);
  }
}
