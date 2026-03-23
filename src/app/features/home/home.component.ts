import { Component, inject } from '@angular/core';
import { APP_PATHS } from "../../shared/models/app-paths.model";
import { CommonModule } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { AppConfigService } from '../../core/services/app-config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ]
})
export class HomeComponent {
  private readonly configService = inject(AppConfigService);
  APP_PATHS = APP_PATHS;
  readonly enableBattleShipFeature = this.configService.get('ENABLE_BATTLESHIP') == 'true';
}
