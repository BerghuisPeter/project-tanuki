import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Message } from "../../shared/models/message.model";
import { FormControl, Validators } from "@angular/forms";
import { ChatService } from "../../shared/chat.service";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";

@Component({
  selector: 'app-global-chat',
  templateUrl: './global-chat.component.html',
  styleUrls: ['./global-chat.component.scss'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic'
      }
    }
  ]
})
export class GlobalChatComponent implements OnInit, OnDestroy {

  connection;
  messages: (Message | string)[] = [];
  inputFormControl: FormControl;
  @ViewChild('chatMessagesContainer') chatMessagesContainer!: ElementRef;

  constructor(public chatService: ChatService, private changeDetectorRef: ChangeDetectorRef) {
    this.inputFormControl = new FormControl<string>('', Validators.required);
    this.connection = chatService.connect();
  }

  ngOnInit(): void {
    this.chatService.joinChat('globalChat');
    this.chatService.message.subscribe(message => this.addNewMessage(message));
    this.chatService.systemNotification.subscribe(message => this.addNewMessage(message));
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  onEnter() {
    const value = this.inputFormControl.getRawValue();
    if (value?.trim()) {
      this.chatService.sendMessage('globalChat', value.trim());
      this.inputFormControl.reset();
    }
  }

  private addNewMessage(message: string | Message) {
    this.messages.push(message);
    this.changeDetectorRef.detectChanges();
    this.scrollMessagesToBottom();
  }

  private scrollMessagesToBottom() {
    const container = this.chatMessagesContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  isString(item: Message | string): item is string {
    return typeof item === 'string';
  }

}
