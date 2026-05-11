import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { LOCALE_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';

describe('LanguageService', () => {
  let service: LanguageService;
  let mockDocument: {
    location: {
      pathname: string;
      href: string;
    }
  };

  beforeEach(() => {
    mockDocument = {
      location: {
        pathname: '/en/home',
        href: ''
      }
    };
    spyOn(localStorage, 'getItem').and.callThrough();
    spyOn(localStorage, 'setItem').and.callThrough();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: LOCALE_ID, useValue: 'en-US' },
        { provide: DOCUMENT, useValue: mockDocument }
      ]
    });
    service = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return current locale', () => {
    expect(service.getCurrentLocale()).toBe('en-US');
  });

  it('should return supported locales', () => {
    const locales = service.getLocales();
    expect(locales.length).toBe(4);
    expect(locales.find(l => l.code === 'en-US')).toBeTruthy();
  });

  it('should redirect to new language URL', () => {
    service.setLanguage('fr-FR');
    expect(mockDocument.location.href).toBe('/fr/home');
  });

  it('should not redirect if same language', () => {
    service.setLanguage('en-US');
    expect(mockDocument.location.href).toBe('');
  });

  it('should handle URL without short code by prepending it', () => {
    mockDocument.location.pathname = '/home';
    service.setLanguage('nl-NL');
    expect(mockDocument.location.href).toBe('/nl/');
  });

  it('should save to localStorage when setting language', () => {
    service.setLanguage('fr-FR');
    expect(localStorage.setItem).toHaveBeenCalledWith('user-locale', 'fr-FR');
  });

  it('should initialize with language from localStorage', () => {
    localStorage.setItem('user-locale', 'ja-JP');

    // We need to re-inject/re-create to test init logic
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: LOCALE_ID, useValue: 'en-US' },
        { provide: DOCUMENT, useValue: mockDocument }
      ]
    });
    service = TestBed.inject(LanguageService);

    expect(mockDocument.location.href).toBe('');
    expect(document.cookie).toContain('user-locale=ja-JP');
  });

  it('should NOT redirect if stored locale matches current short code even if long codes differ', () => {
    localStorage.setItem('user-locale', 'fr-BE'); // Different long code, same short code 'fr'

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: LOCALE_ID, useValue: 'fr-FR' }, // Current is fr-FR
        { provide: DOCUMENT, useValue: mockDocument }
      ]
    });
    mockDocument.location.href = ''; // Reset href
    service = TestBed.inject(LanguageService);

    expect(mockDocument.location.href).toBe(''); // Should NOT redirect
    expect(document.cookie).toContain('user-locale=fr-BE');
  });
});
