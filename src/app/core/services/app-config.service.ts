import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: Record<string, string> = {};

  constructor(private readonly http: HttpClient) {
  }

  async load(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.get<Record<string, string>>('/assets/config.json').pipe(
          tap((config) => {
            this.config = config;
          }),
          catchError((error) => {
            console.warn('Could not load config.json, using defaults or empty config', error);
            return of({});
          })
        )
      );
    } catch (err) {
      console.error('AppConfigService.load() failed', err);
    }
  }

  get(key: string): string {
    return this.config[key] ?? '';
  }
}
