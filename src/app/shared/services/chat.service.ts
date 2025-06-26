import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { Message } from "../models/message.model";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  message = this.socket.fromEvent<Message>('chat:receiveMessage');
  systemNotification = this.socket.fromEvent<string>('chat:systemNotification');

  constructor(private socket: Socket) {
  }

  connect() {
    return this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinChat(roomId: string) {
    this.socket.emit('chat:join', roomId);
  }

  sendMessage(id: string, value: string) {
    this.socket.emit('chat:sendMessage', id, value);
  }
}
