import { TranslocoTestingModule } from '@jsverse/transloco';

export function getTranslocoTestingModule() {
  return TranslocoTestingModule.forRoot({
    langs: {
      'en-US': {},
      'fr-FR': {},
      'ja-JP': {},
      'nl-NL': {}
    },
    translocoConfig: {
      availableLangs: ['en-US', 'fr-FR', 'ja-JP', 'nl-NL'],
      defaultLang: 'en-US',
      fallbackLang: 'en-US',
      reRenderOnLangChange: true
    },
    preloadLangs: true
  });
}

