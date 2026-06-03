import { Component, computed, inject } from '@angular/core';
import { GoshuinBrowserService } from "../goshuin-browser.service";
import { GoshuinBrowserListItemComponent } from "./goshuin-broswer-list-item/goshuin-browser-list-item.component";
import {
  GoshuinBrowserListSkeletonComponent
} from "./goshuin-browser-list-skeleton/goshuin-browser-list-skeleton.component";
import { LanguageService } from "../../../../core/services/language.service";
import { TranslocoDirective } from "@jsverse/transloco";

@Component({
  selector: 'app-goshuin-browser-list',
  imports: [
    GoshuinBrowserListItemComponent,
    GoshuinBrowserListSkeletonComponent,
    TranslocoDirective
  ],
  templateUrl: './goshuin-browser-list.component.html',
  styleUrl: './goshuin-browser-list.component.scss',
})
export class GoshuinBrowserListComponent {
  protected readonly service = inject(GoshuinBrowserService);
  private readonly languageService = inject(LanguageService);
  readonly currentLocale = computed(() =>
    this.languageService.currentLocale().slice(0, 2)
  );
}
