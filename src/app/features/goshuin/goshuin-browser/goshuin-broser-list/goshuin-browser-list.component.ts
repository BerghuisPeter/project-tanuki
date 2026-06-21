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
import { GoshuinBrowserService } from "../goshuin-browser.service";
import { GoshuinBrowserListItemComponent } from "./goshuin-broswer-list-item/goshuin-browser-list-item.component";
import {
  GoshuinBrowserListItemSkeletonComponent
} from "src/app/features/goshuin/goshuin-browser/goshuin-broser-list/goshuin-browser-list-item-skeleton/goshuin-browser-list-item-skeleton.component";
import { LanguageService } from "../../../../core/services/language.service";
import { TranslocoDirective } from "@jsverse/transloco";
import { MatIcon } from "@angular/material/icon";
import { LocationService } from "../../../../shared/services/location.service";
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-goshuin-browser-list',
  imports: [
    GoshuinBrowserListItemComponent,
    GoshuinBrowserListItemSkeletonComponent,
    TranslocoDirective,
    MatIcon,
    MatButton
  ],
  templateUrl: './goshuin-browser-list.component.html',
  styleUrl: './goshuin-browser-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinBrowserListComponent implements AfterViewInit, OnDestroy {
  protected readonly service = inject(GoshuinBrowserService);
  protected readonly locationService = inject(LocationService);
  private readonly languageService = inject(LanguageService);
  readonly currentLocale = computed(() => this.languageService.currentLocale().slice(0, 2));

  readonly locationState = this.locationService.locationState;

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
}
