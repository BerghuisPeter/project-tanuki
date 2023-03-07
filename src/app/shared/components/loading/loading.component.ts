import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() title: string = 'Loading...';
  @Input() subTitle: string = 'The racoons are going going as fast as they can.';

}
