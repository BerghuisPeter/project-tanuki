import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattleshipComponent } from "./battleship.component";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { RouterModule } from "@angular/router";
import { MatChipsModule } from "@angular/material/chips";
import { BattleshipLegendComponent } from './components/battleship-legend/battleship-legend.component';
import { BattleshipBoardComponent } from './components/battleship-board/battleship-board.component';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { RoomSetupComponent } from "../../shared/components/room-setup/room-setup.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";

const routes = [
  {
    path: '',
    component: BattleshipComponent
  }
]

@NgModule({
  declarations: [BattleshipComponent, BattleshipLegendComponent, BattleshipBoardComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatInputModule,
    RoomSetupComponent,
    LoadingComponent
  ]
})
export class BattleshipModule {
}
