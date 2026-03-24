import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly config: Record<string, string>;

  constructor() {
    const env = (globalThis as any).__ENV__;
    this.config = environment.isLocal ? environment : env;
  }

  get(key: string): string {
    return this.config[key] ?? '';
  }
}
