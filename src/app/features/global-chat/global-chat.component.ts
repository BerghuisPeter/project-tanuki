import { ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Message } from "../../shared/models/message.model";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { ChatService } from "../../shared/services/chat.service";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { CharToColorDirective } from "../../shared/directives/char-to-color/char-to-color.directive";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { UserService } from "../../core/services/user.service";

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
  ],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    CharToColorDirective,
    LoadingComponent
  ]
})
export class GlobalChatComponent implements OnInit, OnDestroy {

  messages: (Message)[] = [];
  inputFormControl = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] });
  @ViewChild('chatMessagesContainer') chatMessagesContainer!: ElementRef;

  public chatService = inject(ChatService);
  public readonly userService = inject(UserService);
  connection = this.chatService.connect();
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.chatService.joinChat('globalChat');
    this.chatService.message.subscribe((message: Message) => this.addNewMessage(message));
    this.chatService.systemNotification.subscribe((message: Message) => this.addNewMessage(message, true));
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

  private addNewMessage(message: Message, isSystemNotification = false) {
    this.messages.push({ ...message, origin: isSystemNotification ? 'SYSTEM' : 'USER' });
    this.changeDetectorRef.detectChanges();
    this.scrollMessagesToBottom();
  }

  private scrollMessagesToBottom() {
    const container = this.chatMessagesContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
}
