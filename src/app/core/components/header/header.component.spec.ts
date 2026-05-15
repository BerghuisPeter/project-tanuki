import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { provideHttpClient } from "@angular/common/http";
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from "@angular/router";
import { getTranslocoTestingModule } from '../../../testing/transloco-testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        getTranslocoTestingModule()],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideZoneChangeDetection()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
