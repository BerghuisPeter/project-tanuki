import { inject, Injectable, LOCALE_ID, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export interface LocaleInfo {
  code: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly currentLocaleId = inject(LOCALE_ID);
  private readonly translocoService = inject(TranslocoService);
  private readonly supportedLocales: LocaleInfo[] = [
    { code: 'en-US', label: 'English' },
    { code: 'fr-FR', label: 'Français' },
    { code: 'nl-NL', label: 'Nederlands' },
    { code: 'ja-JP', label: '日本語' }
  ];
  public readonly currentLocale = signal<string>(this.resolveInitialLocale());

  constructor() {
    this.translocoService.setActiveLang(this.currentLocale());
  }

  /**
   * Returns the list of supported locales.
   */
  getLocales(): LocaleInfo[] {
    return this.supportedLocales;
  }

  /**
   * Returns the current locale code.
   */
  getCurrentLocale(): string {
    return this.currentLocale();
  }

  /**
   * Switches the application to a new locale and updates Transloco.
   * @param localeCode The locale code to switch to (e.g., 'en-US', 'fr-FR').
   */
  setLanguage(localeCode: string): void {
    const resolvedLocale = this.resolveSupportedLocale(localeCode);

    if (globalThis.window !== undefined) {
      localStorage.setItem('user_locale', resolvedLocale);
    }

    if (this.currentLocale() === resolvedLocale) {
      return;
    }

    this.translocoService.setActiveLang(resolvedLocale);
    this.currentLocale.set(resolvedLocale);
  }

  private resolveInitialLocale(): string {
    if (globalThis.window !== undefined) {
      const storedLocale = localStorage.getItem('user_locale');
      if (storedLocale) {
        return this.resolveSupportedLocale(storedLocale);
      }
    }

    return this.resolveSupportedLocale(this.currentLocaleId);
  }

  private resolveSupportedLocale(localeCode: string): string {
    const normalizedCode = localeCode.toLowerCase();
    const exactLocale = this.supportedLocales.find(locale => locale.code.toLowerCase() === normalizedCode);

    if (exactLocale) {
      return exactLocale.code;
    }

    const shortCode = this.getShortCode(localeCode);
    const matchedLocale = this.supportedLocales.find(locale => locale.code.toLowerCase().startsWith(shortCode));

    return matchedLocale?.code ?? 'en-US';
  }

  private getShortCode(localeCode: string): string {
    const code = localeCode.toLowerCase();
    if (code.startsWith('en')) return 'en';
    if (code.startsWith('fr')) return 'fr';
    if (code.startsWith('nl')) return 'nl';
    if (code.startsWith('ja')) return 'ja';
    return 'en';
  }
}
