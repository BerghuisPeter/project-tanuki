import { Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { APP_PATHS } from '../../../shared/models/app-paths.model';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DebouncedSearchFieldComponent
} from "../../../shared/components/debounced-search-field/debounced-search-field.component";
import { GoshuinFilterPanelComponent } from "./goshuin-filter-panel/goshuin-filter-panel.component";
import { GoshuinBrowserService } from './goshuin-browser.service';
import { GoshuinBrowserListComponent } from "./goshuin-broser-list/goshuin-browser-list.component";

@Component({
  selector: 'app-goshuin-browser',
  imports: [
    TranslocoDirective,
    MatIcon,
    RouterLink,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatDivider,
    ReactiveFormsModule,
    DebouncedSearchFieldComponent,
    GoshuinFilterPanelComponent,
    GoshuinBrowserListComponent,
  ],
  providers: [GoshuinBrowserService],
  templateUrl: './goshuin-browser.component.html',
  styleUrl: './goshuin-browser.component.scss',
})
export class GoshuinBrowserComponent {
  readonly fullMapLink = ['/', APP_PATHS.GOSHUIN, APP_PATHS.GOSHUIN_MAP];
  protected readonly service = inject(GoshuinBrowserService);
}
