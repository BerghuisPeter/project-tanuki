import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalChatComponent } from './global-chat.component';
import { ChatService } from '../../shared/services/chat.service';
import { Socket } from 'ngx-socket-io';
import { of, Subject } from 'rxjs';
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { provideZoneChangeDetection } from '@angular/core';
import { CharToColorDirective } from "../../shared/directives/char-to-color/char-to-color.directive";
import { getTranslocoTestingModule } from '../../testing/transloco-testing';

describe('GlobalChatComponent', () => {
  let component: GlobalChatComponent;
  let fixture: ComponentFixture<GlobalChatComponent>;

  class MockSocket {
    emit = jasmine.createSpy();
    fromEvent = jasmine.createSpy().and.returnValue(of());
    disconnect = jasmine.createSpy();
  }

  class MockChatService {
    message = new Subject();
    history = new Subject();
    systemNotification = new Subject();
    isConnected$ = new Subject();

    connect() {
      return {};
    }


    disconnect() {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    joinChat(room: string) {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendMessage(room: string, msg: string, user: string) {
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GlobalChatComponent,
        ReactiveFormsModule,
        MatInputModule,
        MatListModule,
        CharToColorDirective,
        LoadingComponent,
        getTranslocoTestingModule()
      ],
      providers: [
        { provide: ChatService, useClass: MockChatService },
        { provide: Socket, useClass: MockSocket },
        provideZoneChangeDetection()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
