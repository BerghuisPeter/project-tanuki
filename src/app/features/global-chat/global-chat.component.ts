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

  messages: Message[] = [];
  inputFormControl: FormControl;

  constructor(public chatService: ChatService) {
    this.inputFormControl = new FormControl<string>('');
    chatService.connect();
  }

  ngOnInit(): void {
    this.chatService.joinChat('globalChat');
    this.chatService.message.subscribe(message => this.messages.push(message));
  }

  onEnter() {
    const value = this.inputFormControl.getRawValue();
    if (value) {
      this.chatService.sendMessage('globalChat', value);
      this.inputFormControl.reset();
    }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

}
