import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BASE_PATH as BASE_PATH_AUTH } from "../openApi/auth";
import { BASE_PATH as BASE_PATH_PROFILE } from "../openApi/profile";
import { authInterceptor } from "./core/interceptors/auth.interceptor";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AppConfigService } from './core/services/app-config.service';
import { provideAppTransloco } from 'src/app/core/i18n/transloco.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Replace deprecated when Angular material has replacement.
    provideAnimationsAsync(),
    importProvidersFrom(MatSnackBarModule),
    {
      provide: BASE_PATH_AUTH,
      useFactory: (config: AppConfigService) => config.get('NG_APP_AUTH_API_URL'),
      deps: [AppConfigService]
    },
    {
      provide: BASE_PATH_PROFILE,
      useFactory: (config: AppConfigService) => config.get('NG_APP_PROFILE_API_URL'),
      deps: [AppConfigService]
    },
    provideAppTransloco()
  ]
};
