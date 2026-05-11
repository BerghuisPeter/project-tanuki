import { inject, Injectable, LOCALE_ID, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface LocaleInfo {
  code: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private static readonly COOKIE_NAME = 'user_locale';
  private readonly document = inject(DOCUMENT);
  private readonly currentLocaleId = inject(LOCALE_ID);
  // Current locale code (e.g., 'en-US')
  public readonly currentLocale = signal<string>(this.currentLocaleId);
  private readonly supportedLocales: LocaleInfo[] = [
    { code: 'en-US', label: $localize`:@@language.en:English` },
    { code: 'fr-FR', label: $localize`:@@language.fr:French` },
    { code: 'nl-NL', label: $localize`:@@language.nl:Dutch` },
    { code: 'ja-JP', label: $localize`:@@language.ja:Japanese` }
  ];

  constructor() {
    this.initLocale();
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
   * Switches the application to a new locale by redirecting to the corresponding base HREF.
   * @param localeCode The locale code to switch to (e.g., 'en-US', 'fr-FR').
   */
  setLanguage(localeCode: string): void {
    if (globalThis.window !== undefined) {
      localStorage.setItem('user_locale', localeCode);
      this.setCookie(localeCode);
    }

    const shortCode = this.getShortCode(localeCode);
    const currentShortCode = this.getShortCode(this.currentLocaleId);

    if (currentShortCode === shortCode) {
      return;
    }

    const currentUrl = this.document.location.pathname;
    const newUrl = currentUrl.replace(`/${currentShortCode}/`, `/${shortCode}/`);

    // If the URL doesn't contain the short code, we might need to prepend it
    // but usually Angular i18n with baseHref handles this.
    if (newUrl === currentUrl) {
      this.document.location.href = `/${shortCode}/`;
    } else {
      this.document.location.href = newUrl;
    }
  }

  private initLocale(): void {
    if (globalThis.window === undefined) {
      return;
    }
    const savedLocale = localStorage.getItem('user_locale');
    if (savedLocale) {
      this.setCookie(savedLocale);
    } else {
      this.setCookie(this.currentLocaleId);
    }
  }

  private getShortCode(localeCode: string): string {
    const code = localeCode.toLowerCase();
    if (code.startsWith('en')) return 'en';
    if (code.startsWith('fr')) return 'fr';
    if (code.startsWith('nl')) return 'nl';
    if (code.startsWith('ja')) return 'ja';
    return 'en'; // Default
  }

  private setCookie(value: string): void {
    if (typeof document !== 'undefined') {
      const date = new Date();
      date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year
      const expires = "; expires=" + date.toUTCString();
      document.cookie = LanguageService.COOKIE_NAME + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    }
  }
}
