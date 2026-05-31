import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";

import { provideZoneChangeDetection } from '@angular/core';
import { getTranslocoTestingModule } from './testing/transloco-testing';
import { registerTestIcons } from './testing/icon-testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        getTranslocoTestingModule()
      ],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideZoneChangeDetection()
      ]
    }).compileComponents();

    TestBed.runInInjectionContext(() => {
      registerTestIcons();
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the header component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });

  it('should render the page loader component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-page-loader')).toBeTruthy();
  });
});
