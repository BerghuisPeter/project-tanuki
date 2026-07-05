import { Component, inject } from '@angular/core';
import { GoshuinBrowserService } from "../goshuin-browser.service";
import { APP_PATHS } from "../../../../shared/models/app-paths.model";
import { MatOption } from "@angular/material/core";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import {
  DebouncedSearchFieldComponent
} from "../../../../shared/components/debounced-search-field/debounced-search-field.component";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatSelect } from "@angular/material/select";
import { TranslocoDirective } from "@jsverse/transloco";
import { GoshuinSort } from "../../../../../openApi/goshuin";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-goshuin-browser-header',
  imports: [
    MatOption,
    MatIcon,
    RouterLink,
    DebouncedSearchFieldComponent,
    MatFormField,
    MatLabel,
    MatSelect,
    TranslocoDirective,
    ReactiveFormsModule,
    MatButton
  ],
  templateUrl: './goshuin-browser-header.component.html',
  styleUrl: './goshuin-browser-header.component.scss',
})
export class GoshuinBrowserHeaderComponent {
  readonly fullMapLink = ['/', APP_PATHS.GOSHUIN, APP_PATHS.GOSHUIN_MAP];
  readonly fullDashBoardLink = ['/', APP_PATHS.GOSHUIN, APP_PATHS.GOSHUIN_DASHBOARD];
  protected readonly service = inject(GoshuinBrowserService);
  protected readonly GoshuinSort = GoshuinSort;
}
