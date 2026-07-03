import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router, RouterLink } from '@angular/router';
import { AffiliationType, GoshuinFormat, TempleLite } from '../../../../openApi/goshuin';
import { APP_PATHS } from '../../../shared/models/app-paths.model';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

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
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    RouterLink
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

  templeFormGroup = this.fb.group({
    templeId: [''],
    templeName: ['', Validators.required],
    city: [''],
    affiliationType: [AffiliationType.Shinto as AffiliationType, Validators.required],
  });
  filteredTemples = toSignal(
    this.templeFormGroup.get('templeName')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.searchTemples(value || ''))
    ),
    { initialValue: [] as TempleLite[] }
  );
  private readonly mockTemples: TempleLite[] = [
    {
      id: '1',
      affiliationType: AffiliationType.Shinto,
      translations: {
        'en-US': {
          name: 'Meiji Jingu',
          city: 'Shibuya',
          region: 'Tokyo',
          postalCode: '151-8557',
          prefecture: 'Tokyo',
          address: '1-1 Yoyogikamizonocho'
        }
      },
      longitude: 139.6993,
      latitude: 35.6764
    },
    {
      id: '2',
      affiliationType: AffiliationType.Buddhist,
      translations: {
        'en-US': {
          name: 'Senso-ji',
          city: 'Asakusa',
          region: 'Tokyo',
          postalCode: '111-0032',
          prefecture: 'Tokyo',
          address: '2-3-1 Asakusa'
        }
      },
      longitude: 139.7967,
      latitude: 35.7148
    },
    {
      id: '3',
      affiliationType: AffiliationType.Shinto,
      translations: {
        'en-US': {
          name: 'Fushimi Inari Taisha',
          city: 'Kyoto',
          region: 'Kansai',
          postalCode: '612-0882',
          prefecture: 'Kyoto',
          address: '68 Fukakusa Yabunouchicho'
        }
      },
      longitude: 135.7727,
      latitude: 34.9671
    }
  ];

  constructor() {
    this.templeFormGroup.get('templeName')!.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(value => {
      const currentSelected = this.templeFormGroup.get('templeId')?.value;
      if (currentSelected && typeof value === 'string') {
        const temple = this.mockTemples.find(t => t.id === currentSelected);
        if (temple && this.getTempleName(temple) !== value) {
          this.templeFormGroup.patchValue({
            templeId: '',
            city: ''
          }, { emitEvent: false });
        }
      }
    });
  }

  getTempleName(temple: TempleLite | null): string {
    if (!temple) return '';
    // For simplicity, taking the first translation available or en-US
    const translation = temple.translations['en-US'] || Object.values(temple.translations)[0];
    return translation?.name || '';
  }

  onTempleSelected(temple: TempleLite) {
    const translation = temple.translations['en-US'] || Object.values(temple.translations)[0];
    this.templeFormGroup.patchValue({
      templeId: temple.id,
      templeName: translation?.name || '',
      city: translation?.city || '',
      affiliationType: temple.affiliationType as AffiliationType
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
    const lowercaseQuery = query.toLowerCase();
    const results = this.mockTemples.filter(temple =>
      Object.values(temple.translations).some(t =>
        t.name.toLowerCase().includes(lowercaseQuery)
      )
    );
    return of(results);
  }
}
