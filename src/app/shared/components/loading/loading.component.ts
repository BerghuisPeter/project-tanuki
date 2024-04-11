import { Component, Input } from '@angular/core';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ],
})
export class LoadingComponent {
  @Input() title: string = 'Loading...';
  @Input() subTitle: string = 'The racoons are going going as fast as they can.';

}
