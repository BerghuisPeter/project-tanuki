import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";

import { provideZoneChangeDetection } from '@angular/core';
import { getTranslocoTestingModule } from './testing/transloco-testing';

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
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the translation key as title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('header.appTitle');
  });

  it('should keep the translated title key when rendered', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.title).toEqual('header.appTitle');
  });
});
