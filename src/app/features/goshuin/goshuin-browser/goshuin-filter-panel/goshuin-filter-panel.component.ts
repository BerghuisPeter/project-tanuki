import { Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { TranslocoDirective } from '@jsverse/transloco';
import { AffiliationType, GoshuinFormat } from '../../../../../openApi/goshuin';
import { GoshuinBrowserService } from '../goshuin-browser.service';
import { NamedChipListFilterComponent } from "./named-chip-list-filter/named-chip-list-filter.component";

@Component({
  selector: 'app-goshuin-filter-panel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatChipListbox,
    MatChipOption,
    NamedChipListFilterComponent,
    TranslocoDirective
  ],
  templateUrl: './goshuin-filter-panel.component.html',
  styleUrl: './goshuin-filter-panel.component.scss'
})
export class GoshuinFilterPanelComponent {
  protected readonly service = inject(GoshuinBrowserService);

  readonly filterCount = computed(() => {
    const values = this.service.filterFormValue();
    return Object.entries(values).filter(([key, value]) => {
      if (key === 'sort' || key === 'search') return false;
      return value !== '' && value != null;
    }).length;
  });

  protected readonly AffiliationType = AffiliationType;
  protected readonly GoshuinFormat = GoshuinFormat;
}
