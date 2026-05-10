import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../shared/models/message.model';
import { ChatUserInfoComponent } from "../chat-user-info/chat-user-info.component";

@Component({
  selector: 'app-chat-system-message',
  standalone: true,
  imports: [CommonModule, ChatUserInfoComponent],
  templateUrl: './chat-system-message.component.html',
})
export class ChatSystemMessageComponent {
  message = input.required<Message>();
}
