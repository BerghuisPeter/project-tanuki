import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";

const routes: Routes = [
  { path: '**', component: PageNotFoundComponent }
]

@NgModule({
  declarations: [PageNotFoundComponent, HeaderComponent],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ]
})
export class CoreModule {
}
