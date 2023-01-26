import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from "./home.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { RouterModule } from "@angular/router";

const routes = [
  {
    path: '',
    component: HomeComponent
  }
]

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatGridListModule
  ]
})
export class HomeModule {
}
