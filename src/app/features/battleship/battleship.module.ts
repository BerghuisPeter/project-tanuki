import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattleshipComponent } from "./battleship.component";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { RouterModule } from "@angular/router";

const routes = [
  {
    path: '',
    component: BattleshipComponent
  }
]

@NgModule({
  declarations: [BattleshipComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatIconModule,
    MatCardModule
  ]
})
export class BattleshipModule {
}
