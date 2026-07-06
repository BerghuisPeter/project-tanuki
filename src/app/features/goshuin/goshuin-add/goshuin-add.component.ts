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
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap
} from 'rxjs';
import {
  DebouncedSearchFieldComponent
} from "../../../shared/components/debounced-search-field/debounced-search-field.component";
import { TranslocoService } from '@jsverse/transloco';
import {
  GoshuinTempleListItemComponent
} from "../components/goshuin-temple-list-item/goshuin-temple-list-item.component";

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
  private readonly fb = inject(FormBuilder);
  isSearching = signal(false);
  private readonly transloco = inject(TranslocoService);

  templeFormGroup = this.fb.group({
    templeId: [''],
    templeName: ['', Validators.required],
    city: ['', Validators.required],
    affiliationType: [AffiliationType.Shinto, Validators.required],
  });
  private readonly templeService = inject(TempleGoshuinService);
  currentLocale = toSignal(
    this.transloco.langChanges$.pipe(map(() => this.transloco.getActiveLang().substring(0, 2))),
    { initialValue: this.transloco.getActiveLang().substring(0, 2) });

  filteredTemples = toSignal(
    combineLatest([
      this.templeFormGroup.get('templeName')!.valueChanges.pipe(startWith(this.templeFormGroup.get('templeName')?.value)),
      this.templeFormGroup.get('city')!.valueChanges.pipe(startWith(this.templeFormGroup.get('city')?.value))
    ]).pipe(
      debounceTime(this.searchDebounceTime),
      distinctUntilChanged((prev, curr) => prev[0] === curr[0] && prev[1] === curr[1]),
      tap(() => this.isSearching.set(true)),
      switchMap(([name, city]) => {
        const query = [name, city].filter(Boolean).join(' ');
        console.log('Searching for:', query);
        return this.searchTemples(query);
      }),
      tap(() => this.isSearching.set(false))
    ),
    { initialValue: [] as Temple[] }
  );

  constructor() {
  }

  onTempleSelected(temple: Temple) {
    this.templeFormGroup.patchValue({
      templeId: temple.id,
    });
  }

  onSubmit() {
    if (this.templeFormGroup.valid && this.detailsFormGroup.valid) {
      // Check if it's a new temple (no templeId)
      if (!this.templeFormGroup.value.templeId) {
        // Validation for new temple: city must be present
        if (!this.templeFormGroup.value.city) {
          this.templeFormGroup.get('city')?.setErrors({ required: true });
          return;
        }
      }

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

  private searchTemples(query: string) {
    if (!query || typeof query !== 'string' || query.length < 2) {
      return of([]);
    }
    return this.templeService.searchTemples(query).pipe(
      catchError(() => of([]))
    );
  }
}
