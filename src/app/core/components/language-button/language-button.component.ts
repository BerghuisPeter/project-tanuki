import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { LanguageService } from "../../services/language.service";

@Component({
  selector: "app-language-button",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./language-button.component.html",
})
export class LanguageButtonComponent {
  public readonly isMenuItem = input<boolean>(false);
  private readonly languageService = inject(LanguageService);

  locales = this.languageService.getLocales();
  currentLocale = this.languageService.currentLocale;

  changeLanguage(localeCode: string): void {
    this.languageService.setLanguage(localeCode);
  }
}
