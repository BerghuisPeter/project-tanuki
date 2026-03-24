import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly config: Record<string, string>;

  constructor() {
    const env: Record<string, string> | undefined = globalThis.__ENV__;
    this.config = environment.isLocal === 'true' ? environment : env;
  }

  get(key: string): string {
    return this.config[key] ?? '';
  }
}
