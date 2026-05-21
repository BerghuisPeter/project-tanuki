import { TestBed } from '@angular/core/testing';
import { BattleshipService } from './battleship.service';
import { SocketService } from '../../../core/services/socket.service';
import { Subject } from 'rxjs';

import { provideZoneChangeDetection } from '@angular/core';

class MockSocket {
  emit = jasmine.createSpy('emit');
  connect = jasmine.createSpy('connect');
  disconnect = jasmine.createSpy('disconnect');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private eventStreams: Record<string, Subject<any>> = {};

  fromEvent<T>(eventName: string) {
    if (!this.eventStreams[eventName]) {
      this.eventStreams[eventName] = new Subject<T>();
    }
    return this.eventStreams[eventName].asObservable();
  }

  triggerEvent<T>(eventName: string, data?: T) {
    this.eventStreams[eventName]?.next(data);
  }
}

describe('BattleshipService', () => {
  let service: BattleshipService;
  let socket: MockSocket;

  beforeEach(() => {
    socket = new MockSocket();

    TestBed.configureTestingModule({
      providers: [
        BattleshipService,
        { provide: SocketService, useValue: socket },
        provideZoneChangeDetection()
      ]
    });

    service = TestBed.inject(BattleshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call connect()', () => {
    service.connect();
    expect(socket.connect).toHaveBeenCalled();
  });

  it('should emit room join', () => {
    service.joinBattleshipRoom('room1');
    expect(socket.emit).toHaveBeenCalledWith('bs:join', 'room1');
  });
});
