import { inject, Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { Message } from "../models/message.model";
import { UserService } from "../../core/services/user.service";
import { map, merge, startWith } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly socket = inject(Socket);
  private readonly userService = inject(UserService);

  readonly isConnected$ = merge(
    this.socket.fromEvent('connect').pipe(map(() => true)),
    this.socket.fromEvent('disconnect').pipe(map(() => false))
  ).pipe(
    startWith(this.socket.ioSocket.connected)
  );

  message = this.socket.fromEvent<Message, 'chat:receiveMessage'>('chat:receiveMessage');
  systemNotification = this.socket.fromEvent<Message, 'chat:systemNotification'>('chat:systemNotification');

  connect() {
    return this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinChat(roomId: string) {
    this.socket.emit('chat:join', roomId, this.userService.user().id);
  }

  sendMessage(roomId: string, value: string) {
    this.socket.emit('chat:sendMessage', roomId, this.userService.user().id, value);
  }
}
