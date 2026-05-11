import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PreferencesComponent } from './preferences.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageService } from '../../core/services/language.service';
import { UserService } from '../../core/services/user.service';
import { PreferencesProfileService, UserPreferences } from '../../../openApi/profile';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let preferencesServiceSpy: jasmine.SpyObj<PreferencesProfileService>;
  let snackBarOpenSpy: jasmine.Spy;

  const mockLocales = [
    { code: 'en-US', label: 'English' },
    { code: 'fr-FR', label: 'Français' }
  ];

  const mockUser = {
    id: '1',
    isGuest: false,
    userPreferences: {
      displayName: 'Test User',
      color: '#ffffff',
      locale: 'en-US',
      avatarUrl: ''
    }
  };

  beforeEach(async () => {
    languageServiceSpy = jasmine.createSpyObj('LanguageService', ['getLocales', 'setLanguage']);
    languageServiceSpy.getLocales.and.returnValue(mockLocales);

    userServiceSpy = jasmine.createSpyObj('UserService', ['setUserPreferences'], {
      user: signal(mockUser)
    });

    preferencesServiceSpy = jasmine.createSpyObj('PreferencesProfileService', ['updateUserPreferences']);

    await TestBed.configureTestingModule({
      imports: [
        PreferencesComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: PreferencesProfileService, useValue: preferencesServiceSpy },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) }
      ]
    }).compileComponents();

    snackBarOpenSpy = (TestBed.inject(MatSnackBar).open as jasmine.Spy);

    fixture = TestBed.createComponent(PreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with locales from language service', () => {
    expect(languageServiceSpy.getLocales).toHaveBeenCalled();
    expect(component.locales).toEqual(mockLocales);
  });

  it('should patch form with user preferences on init', () => {
    expect(component.preferencesForm.value).toEqual(mockUser.userPreferences);
  });

  it('should call languageService.setLanguage on successful submit', fakeAsync(() => {
    const updatedPrefs: UserPreferences = { ...mockUser.userPreferences, locale: 'fr-FR' };
    (preferencesServiceSpy.updateUserPreferences as jasmine.Spy).and.returnValue(of(updatedPrefs));

    component.preferencesForm.patchValue({ locale: 'fr-FR' });
    component.preferencesForm.markAsDirty();

    component.onSubmit();
    tick();

    expect(preferencesServiceSpy.updateUserPreferences).toHaveBeenCalledWith(updatedPrefs);
    expect(userServiceSpy.setUserPreferences).toHaveBeenCalledWith(updatedPrefs);
    expect(languageServiceSpy.setLanguage).toHaveBeenCalledWith('fr-FR');
    expect(component.isSaving()).toBeFalse();
  }));

  it('should handle error on submit', fakeAsync(() => {
    (preferencesServiceSpy.updateUserPreferences as jasmine.Spy).and.returnValue(throwError(() => new Error('Error')));

    component.preferencesForm.patchValue({ locale: 'fr-FR' });
    component.preferencesForm.markAsDirty();

    component.onSubmit();
    tick();

    expect(languageServiceSpy.setLanguage).not.toHaveBeenCalled();
    expect(component.isSaving()).toBeFalse();
  }));
});
