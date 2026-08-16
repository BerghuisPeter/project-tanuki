import { inject, Injectable, signal } from '@angular/core';
import { EnrichmentStatus, Goshuin, GoshuinGoshuinService, GoshuinSort } from '../../../../openApi/goshuin';
import { catchError, finalize, of, tap } from 'rxjs';

@Injectable()
export class GoshuinDashboardService {
  readonly isLoadingQuery = signal(true);
  readonly isLoadingMore = signal(false);
  readonly hasMore = signal(false);
  readonly selectedStatuses = signal<EnrichmentStatus[]>([
    EnrichmentStatus.Pending,
    EnrichmentStatus.Processing,
    EnrichmentStatus.Complete,
    EnrichmentStatus.Failed
  ]);
  private readonly goshuinService = inject(GoshuinGoshuinService);
  // Accumulated results across pages
  private readonly _goshuins = signal<Goshuin[]>([]);
  readonly goshuins = this._goshuins.asReadonly();
  private readonly _nextPageToken = signal<string | undefined>(undefined);

  constructor() {
    this.loadInitial();
  }

  loadInitial(): void {
    this.isLoadingQuery.set(true);
    this._goshuins.set([]);
    this._nextPageToken.set(undefined);
    this.hasMore.set(false);

    this.fetchGoshuins().pipe(
      tap((result) => {
        this._goshuins.set(result.goshuins ?? []);
        this._nextPageToken.set(result.nextPageToken);
        this.hasMore.set(!!result.nextPageToken);
      }),
      catchError(err => {
        console.error('Error loading dashboard goshuins:', err);
        return of({ goshuins: [], nextPageToken: undefined });
      }),
      finalize(() => this.isLoadingQuery.set(false))
    ).subscribe();
  }

  loadMore(): void {
    const token = this._nextPageToken();
    if (!token || this.isLoadingMore()) return;

    this.isLoadingMore.set(true);

    this.fetchGoshuins(token).pipe(
      tap((result) => {
        this._goshuins.update(current => [...current, ...(result.goshuins ?? [])]);
        this._nextPageToken.set(result.nextPageToken);
        this.hasMore.set(!!result.nextPageToken);
      }),
      catchError(err => {
        console.error('Error loading more dashboard goshuins:', err);
        return of({ goshuins: [], nextPageToken: undefined });
      }),
      finalize(() => this.isLoadingMore.set(false))
    ).subscribe();
  }

  setStatusFilter(statuses: EnrichmentStatus[]): void {
    const backendStatuses = [...statuses];
    if (statuses.includes(EnrichmentStatus.Processing)) {
      backendStatuses.push(EnrichmentStatus.Pending);
    }
    this.selectedStatuses.set(backendStatuses);
    this.loadInitial();
  }

  private fetchGoshuins(pageToken?: string) {
    return this.goshuinService.searchGoshuins(
      10,
      undefined,
      undefined,
      undefined,
      undefined,
      true, // mine: true
      GoshuinSort.CreatedAt,
      undefined,
      undefined,
      pageToken,
      this.selectedStatuses(),
    );
  }
}
