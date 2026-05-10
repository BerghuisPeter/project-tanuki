import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharToColorDirective } from '../../../../shared/directives/char-to-color/char-to-color.directive';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-chat-user-info',
  standalone: true,
  imports: [CommonModule, CharToColorDirective, MatIconModule],
  templateUrl: './chat-user-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatUserInfoComponent {
  id = input.required<string>();
  displayName = input<string>();
  color = input<string>();
  avatarUrl = input<string>();
  timestamp = input<number>();
}
