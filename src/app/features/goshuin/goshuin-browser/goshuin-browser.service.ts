import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, EMPTY, merge, startWith, switchMap, tap } from 'rxjs';
import { AffiliationType, GoshuinFormat, GoshuinGoshuinService } from '../../../../openApi/goshuin';

@Injectable()
export class GoshuinBrowserService {
  readonly searchDebounceTime = 700;
  private readonly goshuinService = inject(GoshuinGoshuinService);
  private readonly fb = inject(FormBuilder);
  readonly filterForm = this.fb.group({
    search: [''],
    affiliation: [''],
    format: [''],
    pages: [''],
    sortBy: ['date'],
  });
  readonly filterFormValue = toSignal(
    this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value)
    ),
    { initialValue: this.filterForm.value }
  );
  readonly isLoadingQuery = signal(true);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly anyFormChanges$ = merge(
    this.filterForm.controls.search.valueChanges.pipe(debounceTime(this.searchDebounceTime)),
    this.filterForm.controls.affiliation.valueChanges,
    this.filterForm.controls.format.valueChanges,
    this.filterForm.controls.pages.valueChanges,
    this.filterForm.controls.sortBy.valueChanges
  );

  readonly searchResults = toSignal(
    this.route.queryParams.pipe(
      tap(() => this.isLoadingQuery.set(true)),
      switchMap((params) => {
        this.patchFormFromQueryParams(params);
        if (!params['sortBy']) {
          this.updateUrl();
          return EMPTY;
        }
        return this.loadGoshuins(params);
      }),
      tap(() => this.isLoadingQuery.set(false))
    ),
    { initialValue: [] }
  );

  constructor() {
    this.anyFormChanges$
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

  private loadGoshuins(params: Params) {
    const pagesValue = params['pages'];
    const pages = pagesValue === '' || pagesValue == null ? undefined : [Number(pagesValue)];

    return this.goshuinService.searchGoshuins(
      params['format'] as GoshuinFormat || undefined,
      pages,
      undefined,
      undefined,
      params['affiliation'] as AffiliationType || undefined,
      params['search'] || undefined
    );
  }
}
