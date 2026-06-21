import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  finalize,
  merge,
  of,
  startWith,
  switchMap,
  tap
} from 'rxjs';
import {
  AffiliationType,
  Goshuin,
  GoshuinFormat,
  GoshuinGoshuinService,
  GoshuinSort
} from '../../../../openApi/goshuin';
import { LocationService } from '../../../shared/services/location.service';

@Injectable()
export class GoshuinBrowserService {
  readonly searchDebounceTime = 700;
  private readonly goshuinService = inject(GoshuinGoshuinService);
  readonly currentSort = computed(() => this.filterFormValue().sort);
  private readonly fb = inject(FormBuilder);
  private readonly locationService = inject(LocationService);
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
  readonly locationCoords = this.locationService.coords;

  readonly isLoadingQuery = signal(true);
  readonly isLoadingMore = signal(false);
  readonly hasMore = signal(false);
  readonly locationReady = computed(() => {
    const { coords, permissionStatus, error } = this.locationService.locationState();
    return !!coords || permissionStatus === 'denied' || !!error;
  });
  readonly viewState = computed<'loading' | 'locationBlocked' | 'results'>(() => {
    const { loading } = this.locationService.locationState();
    if (this.isLoadingQuery() || (this.currentSort() === GoshuinSort.Proximity && loading)) {
      return 'loading';
    }
    if (this.currentSort() === GoshuinSort.Proximity && !this.locationCoords()) {
      return 'locationBlocked';
    }
    return 'results';
  });
  private readonly location$ = toObservable(this.locationService.locationState);

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
    // The search depends on the query params and, for proximity sort, on the
    // device location. Combining both streams means a fresh search runs whenever
    // either changes (e.g. when coordinates arrive), without any manual re-trigger.
    combineLatest([this.route.queryParams, toObservable(this.locationReady)]).pipe(
      debounceTime(0),
      tap(() => {
        this.isLoadingQuery.set(true);
        this._goshuins.set([]);
        this._nextPageToken.set(undefined);
        this.hasMore.set(false);
      }),
      switchMap(([params, locationReady]) => {
        this.patchFormFromQueryParams(params);

        if (!params['sort']) {
          this.updateUrl();
          return EMPTY;
        }

        // make sure we have location ready before loading if proximity sort
        if (params['sort'] === GoshuinSort.Proximity && !locationReady) {
          this.isLoadingQuery.set(false);
          return EMPTY;
        }

        // If proximity sort but no coordinates (e.g. denied), don't even call the service
        if (params['sort'] === GoshuinSort.Proximity && !this.locationCoords()) {
          this.isLoadingQuery.set(false);
          this._goshuins.set([]);
          this._nextPageToken.set(undefined);
          this.hasMore.set(false);
          return EMPTY;
        }

        return this.loadGoshuins(params).pipe(
          tap((result) => {
            this._goshuins.set(result.goshuins ?? []);
            this._nextPageToken.set(result.nextPageToken);
            this.hasMore.set(!!result.nextPageToken);
          }),
          catchError(err => {
            console.error('Error loading goshuins:', err);
            return of({ goshuins: [], nextPageToken: undefined });
          }),
          finalize(() => this.isLoadingQuery.set(false))
        );
      }),
      takeUntilDestroyed()
    ).subscribe();

    this.anyFormChanges$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateUrl());

    effect(() => {
      if (this.currentSort() === GoshuinSort.Proximity) {
        this.locationService.ensureLocation();
      }
    });
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

    let lat: number | undefined;
    let lng: number | undefined;

    if (params['sort'] === GoshuinSort.Proximity) {
      const coords = this.locationService.coords();
      if (!coords) {
        throw new Error('Coordinates are required for proximity sort');
      }
      lat = coords.latitude;
      lng = coords.longitude;
    }

    return this.goshuinService.searchGoshuins(
      10,
      params['format'] as GoshuinFormat || undefined,
      pages,
      params['affiliation'] as AffiliationType || undefined,
      params['search'] || undefined,
      params['sort'] as GoshuinSort || undefined,
      lat,
      lng,
      pageToken
    );
  }
}
