import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ProfileProfileService, UserProfile } from 'src/openApi/profile';
import { ProfileService } from '../../core/services/profile.service';
import { HttpEventType } from '@angular/common/http';
import { UserService } from '../../core/services/user.service';
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltip } from "@angular/material/tooltip";
import { LanguageService } from '../../core/services/language.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ImageSelectionComponent } from '../../shared/components/image-selection/image-selection.component';

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
    MatIconModule,
    MatSnackBarModule,
    MatTooltip,
    TranslocoModule,
    ImageSelectionComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  isSaving = signal(false);
  isUploading = signal(false);

  @ViewChild(ImageSelectionComponent) imageSelector!: ImageSelectionComponent;

  private readonly languageService = inject(LanguageService);
  private readonly fb = inject(FormBuilder);
  profileForm: FormGroup = this.fb.group({
    displayName: ['', [Validators.maxLength(45)]],
    color: [''],
    avatarUrl: ['', [Validators.pattern('^(https?://.*)?$')]]
  });
  private readonly userProfileService = inject(ProfileProfileService);
  private readonly profileService = inject(ProfileService);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translocoService = inject(TranslocoService);

  constructor() {
    effect(() => {
      const profile = this.userService.user().profile;
      if (profile) {
        this.profileForm.patchValue(profile, { emitEvent: false });
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

  removeAvatar(): void {
    this.profileForm.patchValue({ avatarUrl: '' });
    this.imageSelector.reset();
    this.onSubmit();
  }

  onReset(): void {
    const profile = this.userService.user().profile;
    if (profile) {
      this.profileForm.reset(profile);
    } else {
      this.profileForm.reset({
        displayName: '',
        color: '',
        avatarUrl: ''
      });
    }
    this.imageSelector.reset();
  }

  onAvatarFilesChanged(files: File[]): void {
    const [file] = files;

    if (!file || this.isUploading() || this.isSaving()) {
      return;
    }

    this.uploadAvatar(file);
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSaving.set(true);

      const profile = this.userService.user().profile;
      const formValue = this.profileForm.value;
      const updatedProfile: UserProfile = {};

      if (formValue.displayName !== profile?.displayName) {
        updatedProfile.displayName = formValue.displayName;
      }
      if (formValue.color !== profile?.color) {
        updatedProfile.color = formValue.color;
      }
      if (formValue.avatarUrl !== profile?.avatarUrl) {
        updatedProfile.avatarUrl = formValue.avatarUrl;
      }

      if (Object.keys(updatedProfile).length === 0) {
        this.isSaving.set(false);
        this.profileForm.markAsPristine();
        return;
      }

      this.userProfileService.updateUserProfile(updatedProfile).subscribe({
        next: (profile) => {
          this.userService.setUserProfile(profile);
          this.isSaving.set(false);
          this.snackBar.open(
            this.translocoService.translate('profile.snackbar.success'),
            this.translocoService.translate('profile.snackbar.close'),
            { duration: 3000 }
          );
          this.profileForm.markAsPristine();
          if (profile.locale) {
            this.languageService.setLanguage(profile.locale);
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
            if (event.type === HttpEventType.Response) {
              const publicUrl = signedUrl.split('?')[0];
              this.profileForm.patchValue({ avatarUrl: publicUrl });
              this.isUploading.set(false);
              this.onSubmit();
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
