import { Component, computed, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { APP_PATHS } from '../../../shared/models/app-paths.model';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { LanguageService } from '../../../core/services/language.service';
import { MatDivider } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from "../../../shared/components/loading/loading.component";
import {
  DebouncedSearchFieldComponent
} from "../../../shared/components/debounced-search-field/debounced-search-field.component";
import { GoshuinFilterPanelComponent } from "./goshuin-filter-panel/goshuin-filter-panel.component";
import { GoshuinBrowserService } from './goshuin-browser.service';

@Component({
  selector: 'app-goshuin-browser',
  imports: [
    TranslocoDirective,
    MatIcon,
    RouterLink,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    MatDivider,
    ReactiveFormsModule,
    LoadingComponent,
    DebouncedSearchFieldComponent,
    GoshuinFilterPanelComponent,
  ],
  providers: [GoshuinBrowserService],
  templateUrl: './goshuin-browser.component.html',
  styleUrl: './goshuin-browser.component.scss',
})
export class GoshuinBrowserComponent {
  readonly fullMapLink = ['/', APP_PATHS.GOSHUIN, APP_PATHS.GOSHUIN_MAP];

  private readonly languageService = inject(LanguageService);
  protected readonly service = inject(GoshuinBrowserService);

  readonly currentLocale = computed(() =>
    this.languageService.currentLocale().slice(0, 2)
  );
}
