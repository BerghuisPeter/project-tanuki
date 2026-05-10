import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";


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
  @Input() title: string = $localize`:@@shared.loading.title:Loading...`;
  @Input() subTitle: string = $localize`:@@shared.loading.subtitle:The racoons are going going as fast as they can.`;
}
