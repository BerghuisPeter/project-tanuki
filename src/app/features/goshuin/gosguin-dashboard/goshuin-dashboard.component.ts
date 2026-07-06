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
import { Goshuin } from '../../../../openApi/goshuin';
import { APP_PATHS } from '../../../shared/models/app-paths.model';
import { GoshuinDashboardService } from "./goshuin-dashboard.service";
import { LanguageService } from "../../../core/services/language.service";
import { TranslocoDirective } from "@jsverse/transloco";

@Component({
  selector: 'app-goshuin-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TranslocoDirective
  ],
  providers: [GoshuinDashboardService],
  templateUrl: './goshuin-dashboard.component.html',
  styleUrl: './goshuin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinDashboardComponent implements AfterViewInit, OnDestroy {
  protected readonly service = inject(GoshuinDashboardService);
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
    return `${t.city}, ${t.prefecture}`;
  }
}
