import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-goshuin-browser-list-item-skeleton',
  standalone: true,
  templateUrl: './goshuin-browser-list-item-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinBrowserListItemSkeletonComponent {
}
