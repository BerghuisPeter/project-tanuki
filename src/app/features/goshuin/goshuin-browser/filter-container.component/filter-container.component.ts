import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UpperCasePipe } from "@angular/common";

@Component({
  selector: 'app-filter-container',
  imports: [
    UpperCasePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-container.component.html',
  styleUrl: './filter-container.component.scss',
})
export class FilterContainerComponent {
  @Input() title: string = '';
}
