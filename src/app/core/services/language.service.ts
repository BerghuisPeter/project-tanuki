import { inject, Injectable, LOCALE_ID, signal } from '@angular/core';

export interface LocaleInfo {
  code: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly currentLocaleId = inject(LOCALE_ID);
  public readonly currentLocale = signal<string>(this.currentLocaleId);
  private readonly supportedLocales: LocaleInfo[] = [
    { code: 'en-US', label: 'English' },
    { code: 'fr-FR', label: 'Français' },
    { code: 'nl-NL', label: 'Nederlands' },
    { code: 'ja-JP', label: '日本語' }
  ];

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
   * Switches the application to a new locale by redirecting to the corresponding base HREF.
   * @param localeCode The locale code to switch to (e.g., 'en-US', 'fr-FR').
   */
  setLanguage(localeCode: string): void {
    if (globalThis.window !== undefined) {
      localStorage.setItem('user_locale', localeCode);
    }

    const shortCode = this.getShortCode(localeCode);
    const currentShortCode = this.getShortCode(this.currentLocaleId);

    if (currentShortCode === shortCode) {
      return;
    }

    // todo here change language using transloco
  }

  private getShortCode(localeCode: string): string {
    const code = localeCode.toLowerCase();
    if (code.startsWith('en')) return 'en';
    if (code.startsWith('fr')) return 'fr';
    if (code.startsWith('nl')) return 'nl';
    if (code.startsWith('ja')) return 'ja';
    return 'en'; // Default
  }
}
