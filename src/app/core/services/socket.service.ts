import { inject, Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly config = inject(AppConfigService);
  private readonly ngZone = inject(NgZone);
  private readonly socket: Socket;

  constructor() {
    const url = this.config.get('NG_APP_SOCKET_SERVER_URL');
    this.socket = io(url, {
      autoConnect: false,
      withCredentials: true
    });
  }

  get connected(): boolean {
    return this.socket.connected;
  }

  connect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  emit(eventName: string, ...args: any[]): void {
    this.socket.emit(eventName, ...args);
  }

  fromEvent<T>(eventName: string): Observable<T> {
    return new Observable<T>(observer => {
      const handler = (data: T) => {
        this.ngZone.run(() => {
          observer.next(data);
        });
      };

      this.socket.on(eventName, handler);

      return () => {
        this.socket.off(eventName, handler);
      };
    });
  }
}
