import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AffiliationType, GoshuinFormat, Temple, TempleGoshuinService } from 'src/openApi/goshuin';
import { APP_PATHS } from 'src/app/shared/models/app-paths.model';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  forkJoin,
  map,
  merge,
  of,
  switchMap,
  take,
  tap
} from 'rxjs';
import {
  DebouncedSearchFieldComponent
} from "src/app/shared/components/debounced-search-field/debounced-search-field.component";
import { TranslocoService } from '@jsverse/transloco';
import {
  GoshuinTempleListItemComponent
} from "../components/goshuin-temple-list-item/goshuin-temple-list-item.component";
import { templeSelectionValidator } from "./utils/templeSelectionValidator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ImageSelectionComponent } from 'src/app/shared/components/image-selection/image-selection.component';
import { ProfileService } from 'src/app/core/services/profile.service';
import { minArrayLengthValidator } from 'src/app/shared/validators/min-array-length.validator';

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
    GoshuinTempleListItemComponent,
    ImageSelectionComponent
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
  isUploadingImages = signal(false);
  uploadedImageUrls = signal<string[]>([]);
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
  imageFormGroup = this.fb.group({
    imageUrls: this.fb.control<string[]>([], [minArrayLengthValidator(1)]),
  });

  detailsFormGroup = this.fb.group({
    format: [GoshuinFormat.Written, Validators.required],
    pages: [1, [Validators.required, Validators.min(1)]],
    description: ['']
  });
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  onSubmit() {
    if (this.isUploadingImages()) {
      return;
    }

    if (this.templeFormGroup.invalid || this.detailsFormGroup.invalid || this.imageFormGroup.invalid) {
      this.templeFormGroup.markAllAsTouched();
      this.detailsFormGroup.markAllAsTouched();
      this.imageFormGroup.markAllAsTouched();
      return;
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

  onGoshuinImagesChanged(files: File[]): void {
    if (!files.length) {
      this.uploadedImageUrls.set([]);
      this.imageFormGroup.patchValue({ imageUrls: [] });
      return;
    }

    this.uploadImages(files.slice(0, 1));
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

  private uploadImages(files: File[]): void {
    this.isUploadingImages.set(true);

    forkJoin(files.map((file) => this.uploadSingleImage(file))).pipe(
      finalize(() => this.isUploadingImages.set(false))
    ).subscribe((urls) => {
      const uploadedUrls = urls.filter((url): url is string => !!url);
      this.uploadedImageUrls.set(uploadedUrls);
      this.imageFormGroup.patchValue({ imageUrls: uploadedUrls });
    });
  }

  private uploadSingleImage(file: File) {
    return this.profileService.getSignedUrl(file.type).pipe(
      switchMap((response) => {
        const signedUrl = response.uploadUrl;

        if (!signedUrl) {
          this.showUploadError();
          return of(null);
        }

        return this.profileService.uploadFile(signedUrl, file).pipe(
          filter((event) => event.type === HttpEventType.Response),
          take(1),
          map(() => signedUrl.split('?')[0]),
          catchError(() => {
            this.showUploadError();
            return of(null);
          })
        );
      }),
      catchError(() => {
        this.showUploadError();
        return of(null);
      })
    );
  }

  private showUploadError(): void {
    this.snackBar.open(
      'Error uploading image. Please try again later.',
      'Dismiss',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      }
    );
  }
}
