import { inject, Injectable } from "@angular/core";
import { Translation, TranslocoLoader } from "@jsverse/transloco";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import enUsTranslations from "src/assets/i18n/en-US.json";

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    private http = inject(HttpClient);

    getTranslation(lang: string) {
      if (lang === 'en-US') {
        return of(enUsTranslations as Translation);
      }

        return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
    }
}
