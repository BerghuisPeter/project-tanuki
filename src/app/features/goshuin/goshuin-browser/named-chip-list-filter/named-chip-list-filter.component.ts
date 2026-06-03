import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UpperCasePipe } from "@angular/common";

@Component({
  selector: 'app-named-chip-list-filter',
  imports: [
    UpperCasePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './named-chip-list-filter.component.html',
  styleUrl: './named-chip-list-filter.component.scss',
})
export class NamedChipListFilterComponent {
  @Input() title: string = '';
}
