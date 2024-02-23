import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { Message } from "./models/message.model";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  message = this.socket.fromEvent<Message>('message');
  systemNotification = this.socket.fromEvent<string>('systemNotification');

  constructor(private socket: Socket) {
  }

  connect() {
    return this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinChat(roomId: string) {
    this.socket.emit('joinChat', roomId);
  }

  sendMessage(id: string, value: string) {
    this.socket.emit('sendMessage', id, value);
  }
}
