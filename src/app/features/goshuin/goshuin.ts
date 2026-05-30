import { Component } from '@angular/core';
import { GoshuinMapComponent } from './components/goshuin-map/goshuin-map.component';
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { TranslocoModule } from "@jsverse/transloco";
import { MatTab, MatTabGroup } from "@angular/material/tabs";

@Component({
  selector: 'app-goshuin',
  imports: [GoshuinMapComponent, LoadingComponent, TranslocoModule, MatTab, MatTabGroup],
  templateUrl: './goshuin.html',
  styleUrl: './goshuin.scss',
})
export class GoshuinComponent {
}
