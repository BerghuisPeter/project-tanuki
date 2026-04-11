import { Component, effect, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { toSignal } from "@angular/core/rxjs-interop";
import { map, merge, scan } from "rxjs";

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

  inputFormControl = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] });
  @ViewChild('chatMessagesContainer') chatMessagesContainer!: ElementRef;

  public chatService = inject(ChatService);
  public readonly userService = inject(UserService);

  readonly isConnected = toSignal(this.chatService.isConnected$, { initialValue: false });

  private readonly messageStream$ = merge(
    this.chatService.message.pipe(map(m => ({ ...m, origin: 'USER' as const }))),
    this.chatService.systemNotification.pipe(map(m => ({ ...m, origin: 'SYSTEM' as const }))),
    this.chatService.history.pipe(map(h => ({ history: h })))
  );

  readonly messages = toSignal(
    this.messageStream$.pipe(
      scan((acc, curr) => {
        if ('history' in curr) {
          return curr.history.map(m => ({ ...m, origin: 'USER' } as Message));
        }
        return [...acc, curr as Message];
      }, [] as Message[])
    ),
    { initialValue: [] }
  );

  constructor() {
    this.chatService.connect();
    effect(() => {
      if (this.messages().length > 0) {
        setTimeout(() => this.scrollMessagesToBottom(), 0);
      }
    });
  }

  ngOnInit(): void {
    this.chatService.joinChat('globalChat');
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

  private scrollMessagesToBottom() {
    const container = this.chatMessagesContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
}
