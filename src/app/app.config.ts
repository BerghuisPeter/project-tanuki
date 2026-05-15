import { ApplicationConfig, ApplicationRef, importProvidersFrom, inject, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { BASE_PATH as BASE_PATH_AUTH } from "../openApi/auth";
import { BASE_PATH as BASE_PATH_PROFILE } from "../openApi/profile";
import { authInterceptor } from "./core/interceptors/auth.interceptor";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AppConfigService } from './core/services/app-config.service';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';

const options = {
  autoConnect: false,
  withCredentials: true
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Replace deprecated when Angular material has replacement.
    provideAnimationsAsync(),
    importProvidersFrom(SocketIoModule, MatSnackBarModule),
    {
      provide: Socket,
      useFactory: (config: AppConfigService) => {
        return new Socket({ url: config.get('NG_APP_SOCKET_SERVER_URL'), options }, inject(ApplicationRef));
      },
      deps: [AppConfigService]
    },
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
    provideTransloco({
      config: {
        availableLangs: ['en-US', 'fr-FR', 'ja-JP', 'nl-NL'],
        defaultLang: 'en-US',
        fallbackLang: 'en-US',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    })
  ]
};
