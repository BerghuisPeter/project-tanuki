import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TempleLite } from 'src/openApi/goshuin';
import { LazyLoadedImgComponent } from 'src/app/shared/components/lazy-loaded-img/lazy-loaded-img.component';
import { MatRippleModule } from '@angular/material/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import { MatCard } from "@angular/material/card";

@Component({
  selector: 'app-goshuin-temple-list-item',
  standalone: true,
  imports: [
    MatIcon,
    LazyLoadedImgComponent,
    MatRippleModule,
    NgClass,
    TitleCasePipe,
    MatCard
  ],
  templateUrl: './goshuin-temple-list-item.component.html',
  styleUrl: './goshuin-temple-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoshuinTempleListItemComponent {
  readonly temple = input.required<TempleLite>();
  readonly currentLocale = input.required<string>();
  readonly isSelected = input<boolean>(false);

  readonly translation = computed(() => this.temple().translations[this.currentLocale()]);

  readonly fullAddress = computed(() => {
    const t = this.translation();
    if (!t) return '';
    return [t.region, t.prefecture, t.city, t.address].filter(Boolean).join(', ');
  });
}
