import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ThemeService } from "../../services/theme.service";

@Component({
  selector: "app-theme-toggle",
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule, MatTooltipModule],
  templateUrl: "./theme-toggle.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  public readonly isMenuItem = input<boolean>(false);
  public readonly themeService = inject(ThemeService);

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  get ThemeTooltip(): string {
    return this.isDarkMode ? "Light mode" : "Dark mode";
  }
}
