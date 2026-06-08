import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { GoshuinFilterPanelComponent } from "./goshuin-filter-panel/goshuin-filter-panel.component";
import { GoshuinBrowserService } from './goshuin-browser.service';
import { GoshuinBrowserListComponent } from "./goshuin-broser-list/goshuin-browser-list.component";

import { GoshuinBrowserHeaderComponent } from "./goshuin-browser-header/goshuin-browser-header.component";

@Component({
  selector: 'app-goshuin-browser',
  imports: [
    TranslocoDirective,
    MatFormFieldModule,
    MatInputModule,
    MatDivider,
    ReactiveFormsModule,
    GoshuinFilterPanelComponent,
    GoshuinBrowserListComponent,
    GoshuinBrowserHeaderComponent,
  ],
  providers: [GoshuinBrowserService],
  templateUrl: './goshuin-browser.component.html',
  styleUrl: './goshuin-browser.component.scss',
})
export class GoshuinBrowserComponent {
}
