import { Component, computed, inject, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { APP_PATHS } from '../../../shared/models/app-paths.model';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AffiliationType, GoshuinFormat, GoshuinGoshuinService } from '../../../../openApi/goshuin';
import { MatCard } from '@angular/material/card';
import { LanguageService } from '../../../core/services/language.service';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { MatDivider } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, finalize, merge, switchMap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LoadingComponent } from "../../../shared/components/loading/loading.component";
import {
  DebouncedSearchFieldComponent
} from "../../../shared/components/debounced-search-field-component/debounced-search-field-component";
import { FilterContainerComponent } from "./filter-container/filter-container.component";

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
    MatChipOption,
    MatChipListbox,
    MatDivider,
    FilterContainerComponent,
    ReactiveFormsModule,
    LoadingComponent,
    DebouncedSearchFieldComponent,
  ],
  templateUrl: './goshuin-browser.component.html',
  styleUrl: './goshuin-browser.component.scss',
})
export class GoshuinBrowserComponent {
  readonly GoshuinFormat = GoshuinFormat;
  readonly fullMapLink = ['/', APP_PATHS.GOSHUIN, APP_PATHS.GOSHUIN_MAP];
  readonly searchDebounceTime = 700;

  private readonly goshuinService = inject(GoshuinGoshuinService);
  private readonly languageService = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  readonly filterForm = this.fb.group({
    search: [''],
    affiliation: [''],
    format: [''],
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
    switchMap((params) => this.loadGoshuins(params))
  );

  readonly searchResults = toSignal(
    this.goshuins$,
    { initialValue: [] }
  );
  protected readonly AffiliationType = AffiliationType;

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
  private readonly formChanges$ = merge(
    this.filterForm.controls.search.valueChanges.pipe(
      debounceTime(this.searchDebounceTime)
    ),
    this.filterForm.controls.affiliation.valueChanges,
    this.filterForm.controls.format.valueChanges,
    this.filterForm.controls.pages.valueChanges,
    this.filterForm.controls.sortBy.valueChanges
  );

  private loadGoshuins(params: Params) {
    this.isLoadingQuery.set(true);

    const pagesValue = params['pages'];
    const pages = pagesValue === '' || pagesValue == null ? undefined : [Number(pagesValue)];

    return this.goshuinService.searchGoshuins(
      params['search'] || undefined,
      params['affiliation'] as AffiliationType || undefined,
      params['format'] as GoshuinFormat || undefined,
      pages,
      undefined,
      undefined
    ).pipe(
      finalize(() => this.isLoadingQuery.set(false))
    );
  }
}
