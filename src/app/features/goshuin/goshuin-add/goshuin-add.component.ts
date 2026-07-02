import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AffiliationType, GoshuinFormat } from '../../../../openApi/goshuin';
import { APP_PATHS } from '../../../shared/models/app-paths.model';

@Component({
  selector: 'app-goshuin-add',
  standalone: true,
  imports: [
    DatePipe,
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
    templeName: ['', Validators.required],
    affiliationType: [AffiliationType.Shinto, Validators.required],
  });

  detailsFormGroup = this.fb.group({
    format: [GoshuinFormat.Written, Validators.required],
    pages: [1, [Validators.required, Validators.min(1)]],
    description: ['']
  });

  imageFormGroup = this.fb.group({
    imageUrl: ['']
  });
  private readonly router = inject(Router);

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
}
