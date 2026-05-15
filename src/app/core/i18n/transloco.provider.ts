import { EnvironmentProviders, isDevMode, makeEnvironmentProviders } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';

export const translocoAvailableLangs = ['en-US', 'fr-FR', 'ja-JP', 'nl-NL'] as const;
export const translocoDefaultLang = 'en-US';

export const translocoConfig = {
  availableLangs: [...translocoAvailableLangs],
  defaultLang: translocoDefaultLang,
  fallbackLang: translocoDefaultLang,
  reRenderOnLangChange: true,
  prodMode: !isDevMode()
};

export function provideAppTransloco(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideTransloco({
      config: translocoConfig,
      loader: TranslocoHttpLoader
    })
  ]);
}

