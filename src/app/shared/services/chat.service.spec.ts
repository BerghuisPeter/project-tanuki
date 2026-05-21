import { TestBed } from '@angular/core/testing';

import { ChatService } from './chat.service';
import { Subject } from "rxjs";
import { SocketService } from "../../core/services/socket.service";


import { provideZoneChangeDetection } from '@angular/core';
import { UserService } from "../../core/services/user.service";

class MockSocket {
  connected = false;

  emit = jasmine.createSpy('emit');
  connect = jasmine.createSpy('connect');
  disconnect = jasmine.createSpy('disconnect');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private streams: Record<string, Subject<any>> = {};

  fromEvent<T>(eventName: string) {
    if (eventName === 'connect' || eventName === 'disconnect') {
      if (!this.streams[eventName]) {
        this.streams[eventName] = new Subject<void>();
      }
    }
    if (!this.streams[eventName]) {
      this.streams[eventName] = new Subject<T>();
    }
    return this.streams[eventName].asObservable();
  }

  trigger<T>(event: string, value: T) {
    this.streams[event]?.next(value);
  }
}


describe('ChatService', () => {
  let service: ChatService;
  let mockSocket: MockSocket;

  beforeEach(() => {
    mockSocket = new MockSocket();

    TestBed.configureTestingModule({
      providers: [
        ChatService,
        UserService,
        { provide: SocketService, useValue: mockSocket },
        provideZoneChangeDetection()
      ]
    });

    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
