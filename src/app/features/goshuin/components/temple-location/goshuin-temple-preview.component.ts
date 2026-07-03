import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TempleLite } from 'src/openApi/goshuin';
import { LazyLoadedImgComponent } from 'src/app/shared/components/lazy-loaded-img/lazy-loaded-img.component';

@Component({
  selector: 'app-goshuin-temple-preview',
  imports: [
    MatIcon,
    LazyLoadedImgComponent
  ],
  templateUrl: './goshuin-temple-preview.component.html',
  styleUrl: './goshuin-temple-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinTemplePreviewComponent {
  readonly temple = input.required<TempleLite>();
  readonly currentLocale = input.required<string>();
  readonly hideTempleImage = input<boolean>(false);

  readonly templeImageUrl = computed(() => {
    if (this.hideTempleImage()) {
      return undefined;
    }
    return this.temple().imageUrl;
  });

  readonly mapsUrl = computed(() => {
    const translation = this.temple().translations[this.currentLocale()];
    const address = [
      translation?.address,
      translation?.city,
      translation?.prefecture
    ].filter(Boolean).join(', ');

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  });
}
