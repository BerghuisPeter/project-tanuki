import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EnrichmentStatus, Goshuin } from '../../../../openApi/goshuin';
import { APP_PATHS } from '../../../shared/models/app-paths.model';
import { GoshuinDashboardService } from "./goshuin-dashboard.service";
import { LanguageService } from "../../../core/services/language.service";
import { TranslocoDirective } from "@jsverse/transloco";
import { LazyLoadedImgComponent } from "../../../shared/components/lazy-loaded-img/lazy-loaded-img.component";

@Component({
  selector: 'app-goshuin-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TranslocoDirective,
    LazyLoadedImgComponent
  ],
  providers: [GoshuinDashboardService],
  templateUrl: './goshuin-dashboard.component.html',
  styleUrl: './goshuin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinDashboardComponent implements AfterViewInit, OnDestroy {
  protected readonly service = inject(GoshuinDashboardService);
  protected readonly EnrichmentStatus = EnrichmentStatus;
  readonly goshuins = this.service.goshuins;
  private readonly languageService = inject(LanguageService);
  readonly currentLocale = computed(() => this.languageService.currentLocale().slice(0, 2));

  addPath = `/${APP_PATHS.GOSHUIN}/${APP_PATHS.GOSHUIN_DASHBOARD}/${APP_PATHS.GOSHUIN_DASHBOARD_ADD}`;
  browserPath = `/${APP_PATHS.GOSHUIN}`;
  @ViewChild('sentinel') private readonly sentinel!: ElementRef<HTMLElement>;
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && this.service.hasMore() && !this.service.isLoadingMore()) {
          this.service.loadMore();
        }
      },
      { threshold: 0.1 }
    );
    this.observer.observe(this.sentinel.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  getTempleName(goshuin: Goshuin): string {
    return goshuin.temple.translations[this.currentLocale()]?.name || goshuin.temple.translations['en']?.name || 'Unknown Temple';
  }

  getTempleLocation(goshuin: Goshuin): string {
    const t = goshuin.temple.translations[this.currentLocale()] || goshuin.temple.translations['en'];
    if (!t) return 'Unknown Location';
    return `${t.address}, ${t.city}, ${t.prefecture}, ${t.region}`;
  }

  getEnrichmentIcon(status: EnrichmentStatus | string | undefined, type: 'goshuin' | 'temple' = 'goshuin'): string {
    switch (status) {
      case EnrichmentStatus.Failed:
        return type === 'goshuin' ? 'error' : 'report';
      case EnrichmentStatus.Complete:
        return type === 'goshuin' ? 'check_circle' : 'verified';
      default:
        return type === 'goshuin' ? 'sync' : 'autorenew';
    }
  }

  getEnrichmentColorClass(status: EnrichmentStatus | string | undefined): string {
    switch (status) {
      case EnrichmentStatus.Failed:
        return '!text-red-600';
      case EnrichmentStatus.Complete:
        return '!text-green-600';
      default:
        return '!text-blue-600';
    }
  }
}
