import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Goshuin } from "../../../../../../openApi/goshuin";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/list";

@Component({
  selector: 'app-goshuin-browser-list-item',
  imports: [
    MatIcon,
    MatButton,
    MatDivider
  ],
  templateUrl: './goshuin-browser-list-item.component.html',
  styleUrl: './goshuin-browser-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinBrowserListItemComponent {
  readonly goshuin = input.required<Goshuin>();
  readonly currentLocale = input.required<string>();
}
