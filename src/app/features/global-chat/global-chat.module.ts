import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalChatComponent } from "./global-chat.component";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { UuidColorModule } from "../../shared/directives/uuid-color/uuid-color.module";

const routes = [
  {
    path: '',
    component: GlobalChatComponent
  }
]

@NgModule({
  declarations: [GlobalChatComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatInputModule,
    MatListModule,
    UuidColorModule
  ]
})
export class GlobalChatModule {
}
