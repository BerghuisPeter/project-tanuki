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
  history = this.socket.fromEvent<Message[], 'chat:history'>('chat:history');
  systemNotification = this.socket.fromEvent<Message, 'chat:systemNotification'>('chat:systemNotification');

  connect() {
    return this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinChat(roomId: string) {
    const user = this.userService.user();
    this.socket.emit('chat:join', roomId, user.id, user.userPreferences?.displayName, user.userPreferences?.color);
  }

  sendMessage(roomId: string, value: string) {
    const user = this.userService.user();
    this.socket.emit('chat:sendMessage', {
      roomId,
      user: {
        userId: user.id,
        displayName: user.userPreferences?.displayName,
        color: user.userPreferences?.color
      },
      message: value
    });
  }
}
