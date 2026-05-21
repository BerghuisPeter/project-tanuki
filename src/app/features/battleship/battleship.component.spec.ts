import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketService } from '../../core/services/socket.service';

import { BattleshipComponent } from './battleship.component';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { RoomSetupComponent } from "../../shared/components/room-setup/room-setup.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { Subject } from "rxjs";
import { BattleshipService } from "./services/battleship.service";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { provideZoneChangeDetection } from '@angular/core';

describe('BattleshipComponent', () => {
  let component: BattleshipComponent;
  let fixture: ComponentFixture<BattleshipComponent>;

  class MockSocket {
    emit = jasmine.createSpy();
  }

  class MockBattleshipService {
    connected$ = new Subject();

    connect() {
      return {};
    }

    disconnect() {
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BattleshipComponent],
      imports: [
        MatCardModule,
        MatChipsModule,
        MatButtonModule,
        MatInputModule,
        RoomSetupComponent,
        LoadingComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: BattleshipService, useClass: MockBattleshipService },
        { provide: SocketService, useClass: MockSocket },
        provideZoneChangeDetection()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BattleshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
