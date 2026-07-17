import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private static readonly THEME_KEY = 'user-theme';
  isDarkMode = signal<boolean>(this.loadTheme());

  constructor() {
    this.applyTheme(this.isDarkMode());
  }

  toggleTheme(): void {
    const newMode = !this.isDarkMode();
    this.isDarkMode.set(newMode);
    this.saveTheme(newMode);
    this.applyTheme(newMode);
  }

  private loadTheme(): boolean {
    const savedTheme = localStorage.getItem(ThemeService.THEME_KEY);
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private saveTheme(isDark: boolean): void {
    localStorage.setItem(ThemeService.THEME_KEY, isDark ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean): void {
    const target = document.documentElement;
    if (isDark) {
      target.classList.add('dark-theme');
      target.classList.remove('light-theme');
      target.style.colorScheme = 'dark';
    } else {
      target.classList.add('light-theme');
      target.classList.remove('dark-theme');
      target.style.colorScheme = 'light';
    }
  }
}
