import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Goshuin } from "src/openApi/goshuin";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/list";
import { DatePipe } from "@angular/common";
import { TranslocoDirective } from "@jsverse/transloco";
import { LazyLoadedImgComponent } from "src/app/shared/components/lazy-loaded-img/lazy-loaded-img.component";
import {
  GoshuinTemplePreviewComponent
} from "src/app/features/goshuin/components/temple-location/goshuin-temple-preview.component";

@Component({
  selector: 'app-goshuin-browser-list-item',
  imports: [
    MatIcon,
    MatButton,
    MatDivider,
    DatePipe,
    LazyLoadedImgComponent,
    GoshuinTemplePreviewComponent,
    TranslocoDirective
  ],
  templateUrl: './goshuin-browser-list-item.component.html',
  styleUrl: './goshuin-browser-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinBrowserListItemComponent {
  readonly goshuin = input.required<Goshuin>();
  readonly currentLocale = input.required<string>();
}
