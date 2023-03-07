import { Injectable } from '@angular/core';
import { Socket } from "ngx-socket-io";
import { v4 as uuidv4 } from 'uuid';
import { Message } from "./models/message.model";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  userName: string;

  message = this.socket.fromEvent<Message>('message');

  constructor(private socket: Socket) {
    this.userName = uuidv4();
  }

  connect(): any {
    return this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinChat(id: string) {
    this.socket.emit('joinChat', this.userName, id);
  }

  sendMessage(id: string, value: string) {
    this.socket.emit('sendMessage', id, value);
  }
}
