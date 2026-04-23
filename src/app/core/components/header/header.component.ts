import { Component, inject, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { TitleCasePipe } from "@angular/common";
import { ThemeService } from "../../services/theme.service";
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component";
import { AuthButtonComponent } from "../auth-button/auth-button.component";
import { PreferencesButtonComponent } from "../preferences-button/preferences-button.component";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, MatButtonModule, TitleCasePipe, AuthButtonComponent, PreferencesButtonComponent, ThemeToggleComponent, RouterLink, MatMenu, MatMenuTrigger],
})
export class HeaderComponent {
  @Input() title: string = 'headerTitle';
  public readonly themeService = inject(ThemeService);

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  get ThemeTooltip(): string {
    return this.isDarkMode ? 'Light mode' : 'Dark mode';
  }
}
