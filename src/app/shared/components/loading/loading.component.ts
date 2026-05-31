import { Component, inject, Input } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";
import { TranslocoService } from "@jsverse/transloco";


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [
    NgOptimizedImage
  ]
})
export class LoadingComponent {
  private readonly t = inject(TranslocoService);
  @Input() title: string = this.t.translate('common.loading');
  @Input() subTitle: string = 'The racoons are going going as fast as they can.';
}
