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
import { AffiliationType, GoshuinFormat, Temple, TempleGoshuinService } from '../../../../openApi/goshuin';
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
  searchDebounceTime = 700;
  goshuinFormats = Object.values(GoshuinFormat);
  isSubmitting = signal(false);
  isSearching = signal(false);
  private readonly fb = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);
  templeFormGroup = this.fb.group({
      templeId: [''],
      templeName: [''],
      city: [''],
      affiliationType: [undefined],
    },
    {
      validators: templeSelectionValidator
    });
  private readonly templeFormGroupChanges$ = merge(
    this.templeFormGroup.controls.templeName.valueChanges.pipe(debounceTime(this.searchDebounceTime), distinctUntilChanged()),
    this.templeFormGroup.controls.city.valueChanges.pipe(debounceTime(this.searchDebounceTime), distinctUntilChanged()),
    this.templeFormGroup.controls.affiliationType.valueChanges.pipe(distinctUntilChanged())
  );
  filteredTemples = toSignal(
    this.templeFormGroupChanges$.pipe(
      tap(() => {
        this.isSearching.set(true);
        this.templeFormGroup.controls.templeId.reset()
      }),
      switchMap(() => {
        return this.searchTemples();
      }),
      tap(() => this.isSearching.set(false))
    ),
    { initialValue: [] as Temple[] }
  );
  private readonly templeService = inject(TempleGoshuinService);
  currentLocale = toSignal(
    this.transloco.langChanges$.pipe(map(() => this.transloco.getActiveLang().substring(0, 2))),
    { initialValue: this.transloco.getActiveLang().substring(0, 2) });
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
  }

  toggleTempleSelect(temple: Temple) {
    const templeIdControl = this.templeFormGroup.controls.templeId;

    templeIdControl.patchValue(
      templeIdControl.value === temple.id ? null : temple.id,
      { emitEvent: false }
    );
  }

  onSubmit() {
    if (this.templeFormGroup.valid && this.detailsFormGroup.valid) {
      this.isSubmitting.set(true);

      // Simulate API call
      console.log('Adding Goshuin:', {
        ...this.templeFormGroup.value,
        ...this.detailsFormGroup.value,
        ...this.imageFormGroup.value
      });

      setTimeout(() => {
        this.isSubmitting.set(false);
        this.router.navigate([this.dashboardPath]);
      }, 1500);
    }
  }

  detailsFormGroup = this.fb.group({
    format: [GoshuinFormat.Written, Validators.required],
    pages: [1, [Validators.required, Validators.min(1)]],
    description: ['']
  });

  imageFormGroup = this.fb.group({
    imageUrl: ['']
  });
  private readonly router = inject(Router);

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
}
