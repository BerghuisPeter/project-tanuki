import { Component, computed, inject, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { APP_PATHS } from '../../../shared/models/app-paths.model';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { GoshuinGoshuinService } from '../../../../openApi/goshuin';
import { MatCard } from '@angular/material/card';
import { LanguageService } from '../../../core/services/language.service';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatDivider } from '@angular/material/list';
import { FilterContainerComponent } from './filter-container.component/filter-container.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, finalize, merge, switchMap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-goshuin-browser',
  imports: [
    TranslocoDirective,
    MatIcon,
    RouterLink,
    MatButton,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    MatChipOption,
    MatChipListbox,
    MatDivider,
    FilterContainerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './goshuin-browser.component.html',
  styleUrl: './goshuin-browser.component.scss',
})
export class GoshuinBrowserComponent {
  readonly fullMapLink = ['/', APP_PATHS.GOSHUIN, APP_PATHS.GOSHUIN_MAP];
  readonly searchDebounceTime = 700;

  private readonly goshuinService = inject(GoshuinGoshuinService);
  private readonly languageService = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  readonly filterForm = this.fb.group({
    search: [''],
    affiliation: [''],
    type: [''],
    pages: [''],
    sortBy: ['date'],
  });
  readonly currentLocale = computed(() =>
    this.languageService.currentLocale().slice(0, 2)
  );
  readonly isLoadingQuery = signal(true);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly goshuins$ = this.route.queryParams.pipe(
    switchMap(() => this.loadGoshuins())
  );

  readonly searchResults = toSignal(
    this.goshuins$,
    { initialValue: [] }
  );

  private readonly formChanges$ = merge(
    this.filterForm.controls.search.valueChanges.pipe(
      debounceTime(this.searchDebounceTime)
    ),
    this.filterForm.controls.affiliation.valueChanges,
    this.filterForm.controls.type.valueChanges,
    this.filterForm.controls.pages.valueChanges,
    this.filterForm.controls.sortBy.valueChanges
  );

  constructor() {
    this.route.queryParams
      .pipe(takeUntilDestroyed())
      .subscribe(params => this.patchFormFromQueryParams(params));

    this.formChanges$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateUrl());
  }

  private patchFormFromQueryParams(params: Params): void {
    this.filterForm.patchValue(
      {
        ...this.filterForm.getRawValue(),
        ...params,
      },
      {
        emitEvent: false,
      }
    );
  }

  private updateUrl(): void {
    const queryParams = this.buildQueryParams();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true,
    });
  }

  private buildQueryParams(): Params {
    const values = this.filterForm.getRawValue();

    return Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        value === '' || value == null ? null : value,
      ])
    );
  }

  private loadGoshuins() {
    this.isLoadingQuery.set(true);

    return this.goshuinService.getGoshuins().pipe(
      finalize(() => this.isLoadingQuery.set(false))
    );
  }
}
