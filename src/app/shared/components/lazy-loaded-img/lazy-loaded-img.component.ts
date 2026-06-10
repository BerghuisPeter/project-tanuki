import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-lazy-loaded-img',
  imports: [],
  templateUrl: './lazy-loaded-img.component.html',
  styleUrl: './lazy-loaded-img.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LazyLoadedImgComponent {
  imageUrl = input<string>();
  alt = input<string>();
  imageLoaded = signal(false);
}
