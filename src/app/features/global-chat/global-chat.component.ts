import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from "../../shared/models/message.model";
import { FormControl } from "@angular/forms";
import { ChatService } from "../../shared/chat.service";

@Component({
  selector: 'app-global-chat',
  templateUrl: './global-chat.component.html',
  styleUrls: ['./global-chat.component.scss']
})
export class GlobalChatComponent implements OnInit, OnDestroy {

  connection;
  messages: (Message | string)[] = [];
  inputFormControl: FormControl;

  constructor(public chatService: ChatService) {
    this.inputFormControl = new FormControl<string>('');
    this.connection = chatService.connect();
  }

  ngOnInit(): void {
    this.chatService.joinChat('globalChat');
    this.chatService.message.subscribe(message => this.messages.push(message));
    this.chatService.systemNotification.subscribe(message => this.messages.push(message));
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  onEnter() {
    const value = this.inputFormControl.getRawValue();
    if (value) {
      this.chatService.sendMessage('globalChat', value);
      this.inputFormControl.reset();
    }
  }

  isString(item: Message | string): item is string {
    return typeof item === 'string';
  }

}
