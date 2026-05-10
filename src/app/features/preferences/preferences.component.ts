import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { PreferencesProfileService, UserPreferences } from '../../../openApi/profile';
import { UserService } from '../../core/services/user.service';
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltip
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss'
})
export class PreferencesComponent {
  isSaving = signal(false);
  locales = [
    { value: 'nl-NL', label: 'Dutch' },
    { value: 'fr-FR', label: 'French' },
    { value: 'en-US', label: 'English' },
    { value: 'ja-JP', label: 'Japanese' }
  ];
  private readonly fb = inject(FormBuilder);
  preferencesForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.maxLength(45)]],
    color: [''],
    locale: ['en-US', [Validators.required]],
    avatarUrl: ['', [Validators.pattern('^(https?://.*)?$')]]
  });
  private readonly preferencesService = inject(PreferencesProfileService);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    effect(() => {
      const prefs = this.userService.user().userPreferences;
      if (prefs) {
        this.preferencesForm.patchValue(prefs, { emitEvent: false });
      }
    });
  }

  clearColor(): void {
    const colorControl = this.preferencesForm.get('color');
    if (colorControl) {
      colorControl.setValue('');
      colorControl.markAsDirty();
    }
  }

  onReset(): void {
    const prefs = this.userService.user().userPreferences;
    if (prefs) {
      this.preferencesForm.reset(prefs);
    } else {
      this.preferencesForm.reset({
        displayName: '',
        color: '',
        locale: 'en-US',
        avatarUrl: ''
      });
    }
  }

  onSubmit(): void {
    if (this.preferencesForm.valid) {
      this.isSaving.set(true);
      const updatedPrefs: UserPreferences = this.preferencesForm.value;
      this.preferencesService.updateUserPreferences(updatedPrefs).subscribe({
        next: (prefs) => {
          this.userService.setUserPreferences(prefs);
          this.isSaving.set(false);
          this.snackBar.open('Preferences saved successfully', 'Close', { duration: 3000 });
          this.preferencesForm.markAsPristine();
        },
        error: (err) => {
          console.error('Error saving preferences', err);
          this.snackBar.open('Failed to save preferences', 'Close', { duration: 3000 });
          this.isSaving.set(false);
        }
      });
    }
  }
}
