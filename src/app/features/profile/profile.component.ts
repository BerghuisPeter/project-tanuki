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
import { PreferencesProfileService, UserPreferences } from 'src/openApi/profile';
import { ProfileService } from '../../core/services/profile.service';
import { HttpEventType } from '@angular/common/http';
import { UserService } from '../../core/services/user.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltip } from "@angular/material/tooltip";
import { LanguageService } from '../../core/services/language.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-profile',
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
    MatProgressBarModule,
    MatSnackBarModule,
    MatTooltip,
    TranslocoModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  isSaving = signal(false);
  isUploading = signal(false);
  uploadProgress = signal(0);
  private readonly languageService = inject(LanguageService);
  locales = this.languageService.getLocales();
  private readonly fb = inject(FormBuilder);
  profileForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.maxLength(45)]],
    color: [''],
    locale: ['en-US', [Validators.required]],
    avatarUrl: ['', [Validators.pattern('^(https?://.*)?$')]]
  });
  private readonly preferencesService = inject(PreferencesProfileService);
  private readonly profileService = inject(ProfileService);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translocoService = inject(TranslocoService);

  constructor() {
    effect(() => {
      const prefs = this.userService.user().userPreferences;
      if (prefs) {
        this.profileForm.patchValue(prefs, { emitEvent: false });
      }
    });
  }

  clearColor(): void {
    const colorControl = this.profileForm.get('color');
    if (colorControl) {
      colorControl.setValue('');
      colorControl.markAsDirty();
    }
  }

  onReset(): void {
    const prefs = this.userService.user().userPreferences;
    if (prefs) {
      this.profileForm.reset(prefs);
    } else {
      this.profileForm.reset({
        displayName: '',
        color: '',
        locale: 'en-US',
        avatarUrl: ''
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadAvatar(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSaving.set(true);
      const updatedPrefs: UserPreferences = this.profileForm.value;
      this.preferencesService.updateUserPreferences(updatedPrefs).subscribe({
        next: (prefs) => {
          this.userService.setUserPreferences(prefs);
          this.isSaving.set(false);
          this.snackBar.open(
            this.translocoService.translate('profile.snackbar.success'),
            this.translocoService.translate('profile.snackbar.close'),
            { duration: 3000 }
          );
          this.profileForm.markAsPristine();
          if (prefs.locale) {
            this.languageService.setLanguage(prefs.locale);
          }
        },
        error: (err) => {
          console.error('Error saving profile', err);
          this.snackBar.open(
            this.translocoService.translate('profile.snackbar.error'),
            this.translocoService.translate('profile.snackbar.close'),
            { duration: 3000 }
          );
          this.isSaving.set(false);
        }
      });
    }
  }

  private uploadAvatar(file: File): void {
    this.isUploading.set(true);
    this.uploadProgress.set(0);

    this.profileService.getSignedUrl(file.type).subscribe({
      next: (response) => {
        const signedUrl = response.uploadUrl;

        if (!signedUrl) {
          console.error('No signed URL received');
          this.isUploading.set(false);
          return;
        }

        this.profileService.uploadFile(signedUrl, file).subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              this.uploadProgress.set(Math.round((100 * event.loaded) / event.total));
            } else if (event.type === HttpEventType.Response) {
              // Extract the URL before query parameters from the signed URL to get the public URL
              const publicUrl = signedUrl.split('?')[0];
              this.profileForm.patchValue({ avatarUrl: publicUrl });
              this.profileForm.markAsDirty();
              this.isUploading.set(false);
              this.snackBar.open(
                this.translocoService.translate('profile.snackbar.uploadSuccess'),
                this.translocoService.translate('profile.snackbar.close'),
                { duration: 3000 }
              );
            }
          },
          error: (err) => {
            console.error('Error uploading file', err);
            this.isUploading.set(false);
            this.snackBar.open(
              this.translocoService.translate('profile.snackbar.uploadError'),
              this.translocoService.translate('profile.snackbar.close'),
              { duration: 3000 }
            );
          }
        });
      },
      error: (err) => {
        console.error('Error getting signed URL', err);
        this.isUploading.set(false);
        this.snackBar.open(
          this.translocoService.translate('profile.snackbar.uploadError'),
          this.translocoService.translate('profile.snackbar.close'),
          { duration: 3000 }
        );
      }
    });
  }
}
