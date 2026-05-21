import { inject, Injectable } from '@angular/core';
import { SocketService } from '../../core/services/socket.service';
import { Message } from "../models/message.model";
import { UserService } from "../../core/services/user.service";
import { map, merge, startWith } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly socket = inject(SocketService);
  private readonly userService = inject(UserService);

  readonly isConnected$ = merge(
    this.socket.fromEvent('connect').pipe(map(() => true)),
    this.socket.fromEvent('disconnect').pipe(map(() => false))
  ).pipe(
    startWith(this.socket.connected)
  );

  message = this.socket.fromEvent<Message>('chat:receiveMessage');
  history = this.socket.fromEvent<Message[]>('chat:history');
  systemNotification = this.socket.fromEvent<Message>('chat:systemNotification');

  connect() {
    return this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinChat(roomId: string) {
    const user = this.userService.user();
    this.socket.emit('chat:join', roomId, user.id, user.profile?.displayName, user.profile?.color, user.profile?.avatarUrl);
  }

  sendMessage(roomId: string, value: string) {
    const user = this.userService.user();
    this.socket.emit('chat:sendMessage', {
      roomId,
      user: {
        userId: user.id,
        displayName: user.profile?.displayName,
        color: user.profile?.color,
        avatarUrl: user.profile?.avatarUrl
      },
      message: value
    });
  }
}
