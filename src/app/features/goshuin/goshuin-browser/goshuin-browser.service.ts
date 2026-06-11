import { inject, Injectable, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, EMPTY, finalize, merge, startWith, switchMap, tap } from 'rxjs';
import {
  AffiliationType,
  Goshuin,
  GoshuinFormat,
  GoshuinGoshuinService,
  GoshuinSort
} from '../../../../openApi/goshuin';

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
    sort: ['createdAt'],
  });
  readonly filterFormValue = toSignal(
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    { initialValue: this.filterForm.value }
  );

  readonly isLoadingQuery = signal(true);
  readonly isLoadingMore = signal(false);
  readonly hasMore = signal(false);

  // Accumulated results across pages
  private readonly _goshuins = signal<Goshuin[]>([]);
  readonly goshuins = this._goshuins.asReadonly();
  private readonly _nextPageToken = signal<string | undefined>(undefined);

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly _queryParams = toSignal(this.route.queryParams, { initialValue: {} });

  private readonly anyFormChanges$ = merge(
    this.filterForm.controls.search.valueChanges.pipe(debounceTime(this.searchDebounceTime), distinctUntilChanged()),
    this.filterForm.controls.affiliation.valueChanges.pipe(distinctUntilChanged()),
    this.filterForm.controls.format.valueChanges.pipe(distinctUntilChanged()),
    this.filterForm.controls.pages.valueChanges.pipe(distinctUntilChanged()),
    this.filterForm.controls.sort.valueChanges.pipe(distinctUntilChanged())
  );

  constructor() {
    // React to query param changes by resetting and loading fresh
    this.route.queryParams.pipe(
      tap(() => {
        this.isLoadingQuery.set(true);
        this._goshuins.set([]);
        this._nextPageToken.set(undefined);
        this.hasMore.set(false);
      }),
      switchMap((params) => {
        this.patchFormFromQueryParams(params);
        if (!params['sort']) {
          this.updateUrl();
          return EMPTY;
        }
        return this.loadGoshuins(params).pipe(
          tap((result) => {
            this._goshuins.set(result.goshuins ?? []);
            this._nextPageToken.set(result.nextPageToken);
            this.hasMore.set(!!result.nextPageToken);
          }),
          finalize(() => this.isLoadingQuery.set(false))
        );
      }),
      takeUntilDestroyed()
    ).subscribe();

    this.anyFormChanges$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateUrl());
  }

  loadMore(): void {
    const token = this._nextPageToken();
    if (!token || this.isLoadingMore()) return;

    this.isLoadingMore.set(true);
    const params = this._queryParams();

    this.loadGoshuins(params, token).pipe(
      tap((result) => {
        this._goshuins.update(current => [...current, ...(result.goshuins ?? [])]);
        this._nextPageToken.set(result.nextPageToken);
        this.hasMore.set(!!result.nextPageToken);
      }),
      finalize(() => this.isLoadingMore.set(false))
    ).subscribe();
  }

  private patchFormFromQueryParams(params: Params): void {
    this.filterForm.patchValue({ ...this.filterForm.getRawValue(), ...params });
  }

  private updateUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.buildQueryParams(),
      replaceUrl: true,
    });
  }

  private buildQueryParams(): Params {
    const values = this.filterForm.getRawValue();
    return Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value === '' || value == null ? null : value])
    );
  }

  private loadGoshuins(params: Params, pageToken?: string) {
    const pagesValue = params['pages'];
    const pages = pagesValue === '' || pagesValue == null ? undefined : [Number(pagesValue)];

    return this.goshuinService.searchGoshuins(
      10,
      params['format'] as GoshuinFormat || undefined,
      pages,
      params['affiliation'] as AffiliationType || undefined,
      params['search'] || undefined,
      params['sort'] as GoshuinSort || undefined,
      pageToken
    );
  }
}
