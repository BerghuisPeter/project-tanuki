import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Goshuin } from "src/openApi/goshuin";
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/list";
import { DatePipe } from "@angular/common";
import { TranslocoDirective } from "@jsverse/transloco";
import { LazyLoadedImgComponent } from "src/app/shared/components/lazy-loaded-img/lazy-loaded-img.component";
import { GoshuinTempleComponent } from "src/app/features/goshuin/components/goshuin-temple/goshuin-temple.component";
import { ParallaxDirective } from "src/app/shared/directives/parallax/parallax.directive";

@Component({
  selector: 'app-goshuin-browser-list-item',
  imports: [
    MatIcon,
    MatButton,
    MatDivider,
    DatePipe,
    LazyLoadedImgComponent,
    GoshuinTempleComponent,
    TranslocoDirective,
    ParallaxDirective
  ],
  templateUrl: './goshuin-browser-list-item.component.html',
  styleUrl: './goshuin-browser-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinBrowserListItemComponent {
  readonly goshuin = input.required<Goshuin>();
  readonly currentLocale = input.required<string>();
}
