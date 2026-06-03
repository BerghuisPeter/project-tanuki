import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-goshuin-browser-list-skeleton',
  standalone: true,
  templateUrl: './goshuin-browser-list-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinBrowserListSkeletonComponent {
}
