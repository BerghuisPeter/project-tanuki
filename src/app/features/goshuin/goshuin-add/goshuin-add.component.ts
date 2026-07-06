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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import {
  DebouncedSearchFieldComponent
} from "../../../shared/components/debounced-search-field/debounced-search-field.component";
import { TranslocoService } from '@jsverse/transloco';
import { GoshuinTempleComponent } from "../components/goshuin-temple/goshuin-temple.component";

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
    GoshuinTempleComponent
  ],
  templateUrl: './goshuin-add.component.html',
  styleUrl: './goshuin-add.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinAddComponent {
  dashboardPath = `/${APP_PATHS.GOSHUIN}/${APP_PATHS.GOSHUIN_DASHBOARD}`;
  affiliationTypes = Object.values(AffiliationType);
  goshuinFormats = Object.values(GoshuinFormat);
  isSubmitting = signal(false);
  private readonly fb = inject(FormBuilder);
  isSearching = signal(false);
  filteredTemples = toSignal(
    this.templeFormGroup.get('templeName')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isSearching.set(true)),
      switchMap(value => this.searchTemples(value || '')),
      tap(() => this.isSearching.set(false))
    ),
    { initialValue: [] as Temple[] }
  );
  private readonly transloco = inject(TranslocoService);

  templeFormGroup = this.fb.group({
    templeId: [''],
    templeName: ['', Validators.required],
    city: [''],
    affiliationType: [AffiliationType.Shinto as AffiliationType, Validators.required],
  });
  private readonly templeService = inject(TempleGoshuinService);
  private readonly selectedTemple = signal<Temple | null>(null);
  currentLocale = toSignal(
    this.transloco.langChanges$.pipe(map(() => this.transloco.getActiveLang().substring(0, 2))),
    { initialValue: this.transloco.getActiveLang().substring(0, 2) });

  constructor() {
    this.templeFormGroup.get('templeName')!.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(value => {
      const currentSelected = this.templeFormGroup.get('templeId')?.value;
      if (currentSelected && typeof value === 'string') {
        const selected = this.selectedTemple();
        if (selected && this.getTempleName(selected) !== value) {
          this.templeFormGroup.patchValue({
            templeId: '',
            city: ''
          }, { emitEvent: false });
          this.selectedTemple.set(null);
        }
      }
    });
  }

  getTempleName(temple: Temple | null): string {
    if (!temple) return '';
    const translation = temple.translations['en'] || Object.values(temple.translations)[0];
    return translation?.name || '';
  }

  onTempleSelected(temple: Temple) {
    this.selectedTemple.set(temple);
    this.templeFormGroup.patchValue({
      templeId: temple.id
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
