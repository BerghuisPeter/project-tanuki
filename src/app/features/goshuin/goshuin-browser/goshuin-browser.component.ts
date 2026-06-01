import { Component, computed, inject, signal } from '@angular/core';
import { TranslocoDirective } from "@jsverse/transloco";
import { APP_PATHS } from "../../../shared/models/app-paths.model";
import { MatIcon } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatButton } from "@angular/material/button";
import { MatFormField, MatInputModule } from "@angular/material/input";
import { Goshuin, GoshuinGoshuinService } from "../../../../openApi/goshuin";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatCard } from "@angular/material/card";
import { LanguageService } from "../../../core/services/language.service";
import { MatChipListbox, MatChipOption } from "@angular/material/chips";
import { MatDivider } from "@angular/material/list";
import { FilterContainerComponent } from "./filter-container.component/filter-container.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { distinctUntilChanged } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-goshuin-browser',
  imports: [
    TranslocoDirective,
    MatIcon,
    RouterLink,
    MatButton,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    MatChipOption,
    MatChipListbox,
    MatDivider,
    FilterContainerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './goshuin-browser.component.html',
  styleUrl: './goshuin-browser.component.scss',
})
export class GoshuinBrowserComponent {
  readonly fullMapLink = ['/', APP_PATHS.GOSHUIN, APP_PATHS.GOSHUIN_MAP];
  isLoadingQuery = signal(true);
  searchResults = signal<Goshuin[]>([]);
  private readonly goshuinService = inject(GoshuinGoshuinService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly languageService = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  filterForm = this.fb.group({
    search: [''],
    affiliation: [''],
    type: [''],
    pages: [''],
    sortBy: ['date']
  });
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  currentLocale = computed(() => this.languageService.currentLocale().slice(0, 2));

  constructor() {
    this.filterForm.valueChanges.pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      takeUntilDestroyed()
    ).subscribe((values) => {

      console.log('values:', values);

      const queryParams = Object.fromEntries(
        Object.entries(values).filter(
          ([_, v]) => v !== null && v !== undefined && v !== ''
        )
      );

      console.log('queryParams:', queryParams);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: queryParams,
        queryParamsHandling: 'replace',
      });
    });

    this.route.queryParams.pipe(
      takeUntilDestroyed()
    ).subscribe(params => {
      this.filterForm.patchValue(params, { emitEvent: false });
      this.search();
    });
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
