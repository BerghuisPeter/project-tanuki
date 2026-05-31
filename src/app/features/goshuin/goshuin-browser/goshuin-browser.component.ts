import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TranslocoDirective } from "@jsverse/transloco";
import { APP_PATHS } from "../../../shared/models/app-paths.model";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatInput } from "@angular/material/input";
import { Goshuin, GoshuinGoshuinService } from "../../../../openApi/goshuin";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatCard } from "@angular/material/card";
import { LanguageService } from "../../../core/services/language.service";
import { MatChipListbox, MatChipOption } from "@angular/material/chips";
import { MatDivider } from "@angular/material/list";

@Component({
  selector: 'app-goshuin-browser',
  imports: [
    TranslocoDirective,
    MatIcon,
    RouterLink,
    MatButton,
    MatFormField,
    MatInput,
    MatCard,
    MatChipOption,
    MatChipListbox,
    MatDivider,
  ],
  templateUrl: './goshuin-browser.component.html',
  styleUrl: './goshuin-browser.component.scss',
})
export class GoshuinBrowserComponent implements OnInit {
  readonly fullMapLink = ['/', APP_PATHS.GOSHUIN, APP_PATHS.GOSHUIN_MAP];
  isLoadingQuery = signal(true);
  searchResults = signal<Goshuin[]>([]);
  private readonly goshuinService = inject(GoshuinGoshuinService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly languageService = inject(LanguageService);
  currentLocale = computed(() => this.languageService.currentLocale().slice(0, 2));

  ngOnInit(): void {
    this.search();
  }

  private search() {
    this.isLoadingQuery.set(true);
    this.goshuinService.getGoshuins().subscribe({
      next: (goshuins) => {
        this.searchResults.set(goshuins);
        this.isLoadingQuery.set(false);
      },
      error: () => {
        this.isLoadingQuery.set(false);
        this.snackBar.open('error loading search', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['bg-red-500', 'text-white']
        });
      }
    });
  }

}
