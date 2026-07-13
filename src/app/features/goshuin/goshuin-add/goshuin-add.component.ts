import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import {
  AffiliationType,
  GoshuinCreate,
  GoshuinFormat,
  GoshuinGoshuinService,
  GoshuinTranslation,
  Temple,
  TempleGoshuinService
} from '../../../../openApi/goshuin';
import { APP_PATHS } from '../../../shared/models/app-paths.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, map, merge, of, switchMap, tap } from 'rxjs';
import {
  DebouncedSearchFieldComponent
} from "../../../shared/components/debounced-search-field/debounced-search-field.component";
import { TranslocoService } from '@jsverse/transloco';
import {
  GoshuinTempleListItemComponent
} from "../components/goshuin-temple-list-item/goshuin-temple-list-item.component";
import { templeSelectionValidator } from "./utils/templeSelectionValidator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { nonEmptyArray } from "./utils/nonEmptyArrayValidator";

@Component({
  selector: 'app-goshuin-add',
  standalone: true,
  imports: [
    TitleCasePipe,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatRippleModule,
    RouterLink,
    DebouncedSearchFieldComponent,
    GoshuinTempleListItemComponent
  ],
  templateUrl: './goshuin-add.component.html',
  styleUrl: './goshuin-add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinAddComponent {
  dashboardPath = `/${APP_PATHS.GOSHUIN}/${APP_PATHS.GOSHUIN_DASHBOARD}`;
  affiliationTypes = Object.values(AffiliationType);
  goshuinFormats = Object.values(GoshuinFormat);
  searchDebounceTime = 700;
  private readonly fb = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);
  isSubmitting = signal(false);
  isSearching = signal(false);
  templeFormGroup = this.fb.group({
      selectedTemple: this.fb.control<Temple | undefined>(undefined),
      templeName: [''],
      city: [''],
      affiliationType: this.fb.control<AffiliationType | undefined>(undefined),
    },
    {
      validators: templeSelectionValidator
    });
  detailsFormGroup = this.fb.group({
    format: this.fb.control(GoshuinFormat.Written, {
      validators: Validators.required,
      nonNullable: true,
    }),
    pages: this.fb.control(1, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
    label: ['testLabel'],
    description: ['testDescription']
  });
  imageFormGroup = this.fb.group({
    imageUrl: this.fb.control(['https://storage.googleapis.com/tanuki-dev-assets/goshuin/Goshuin-Shikoku.png'], {
      validators: [nonEmptyArray],
      nonNullable: true,
    }),
  });
  private readonly router = inject(Router);
  private readonly templeFormGroupChanges$ = merge(
    this.templeFormGroup.controls.templeName.valueChanges.pipe(debounceTime(this.searchDebounceTime), distinctUntilChanged()),
    this.templeFormGroup.controls.city.valueChanges.pipe(debounceTime(this.searchDebounceTime), distinctUntilChanged()),
    this.templeFormGroup.controls.affiliationType.valueChanges.pipe(distinctUntilChanged())
  );
  currentLocale = toSignal(
    this.transloco.langChanges$.pipe(map(() => this.transloco.getActiveLang().substring(0, 2))),
    { initialValue: this.transloco.getActiveLang().substring(0, 2) });
  private readonly goshuinService = inject(GoshuinGoshuinService);
  private readonly templeService = inject(TempleGoshuinService);
  private readonly snackBar = inject(MatSnackBar);
  filteredTemples = toSignal(
    this.templeFormGroupChanges$.pipe(
      tap(() => {
        this.isSearching.set(true);
        this.templeFormGroup.controls.selectedTemple.reset()
      }),
      switchMap(() => {
        return this.searchTemples();
      }),
      tap(() => this.isSearching.set(false))
    ),
    { initialValue: [] as Temple[] }
  );

  constructor() {
  }

  toggleTempleSelect(temple: Temple) {
    const selectedTempleControl = this.templeFormGroup.controls.selectedTemple;

    selectedTempleControl.patchValue(
      selectedTempleControl.value === temple ? undefined : temple,
      { emitEvent: false }
    );
  }

  onSubmit() {
    if (this.templeFormGroup.valid && this.detailsFormGroup.valid) {
      this.isSubmitting.set(true);
      const goshuin: GoshuinCreate = {
        templeId: this.templeFormGroup.controls.selectedTemple.value?.id || undefined,
        format: this.detailsFormGroup.controls.format.value,
        pages: this.detailsFormGroup.controls.pages.value,
        originalLocale: this.transloco.getActiveLang(),
        translations: this.buildTranslations(),
        imageUrls: this.imageFormGroup.controls.imageUrl.value
      };
      this.goshuinService.createGoshuin(goshuin).subscribe(() => {
        this.isSubmitting.set(false);
        this.router.navigate([this.dashboardPath]);
      });
    }
  }

  private searchTemples() {
    const { templeName, city, affiliationType } = this.templeFormGroup.getRawValue();

    if (
      !templeName &&
      !city &&
      !affiliationType
    ) {
      return of([]);
    }

    return this.templeService.searchTemples(
      templeName || undefined,
      city || undefined,
      affiliationType ?? undefined
    ).pipe(
      catchError(() => {
        this.snackBar.open(
          'Error searching temples. Please try again later.',
          'Dismiss',
          {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          }
        );

        return of([]);
      })
    );
  }

  private buildTranslations(): Record<string, GoshuinTranslation> {
    const label = this.detailsFormGroup.controls.label.value?.trim();
    const description = this.detailsFormGroup.controls.description.value?.trim();

    if (!label && !description) {
      return {};
    }

    return {
      [this.currentLocale()]: {
        ...(label && { label }),
        ...(description && { description }),
      }
    };
  }
}
