import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component";
import { AuthButtonComponent } from "../auth-button/auth-button.component";
import { PreferencesButtonComponent } from "../preferences-button/preferences-button.component";
import { LanguageButtonComponent } from "../language-button/language-button.component";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, MatButtonModule, AuthButtonComponent, PreferencesButtonComponent, LanguageButtonComponent, ThemeToggleComponent, RouterLink, MatMenu, MatMenuTrigger, TranslocoModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() title: string = 'header.appTitle';
}
