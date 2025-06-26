import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BattleshipService {

  private readonly connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();

  private readonly connectionErrorSubject = new BehaviorSubject<boolean>(false);
  public connectionError$ = this.connectionErrorSubject.asObservable();

  constructor(private readonly socket: Socket) {
    this.socket.fromEvent('connect').subscribe(() => {
      this.connectedSubject.next(true);
      this.connectionErrorSubject.next(false);
      console.log('Connected');
    });

    // this.socket.fromEvent('disconnect').subscribe(() => {
    //   this.connectedSubject.next(false);
    // });

    this.socket.fromEvent('connect_error').subscribe(() => {
      this.connectionErrorSubject.next(true);
    });
  }

  connect() {
    return this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinBattleshipRoom(roomId: string) {
    this.socket.emit('bs:join', roomId);
  }


}
