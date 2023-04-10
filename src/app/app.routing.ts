import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_PATHS } from "./shared/models/app-paths.model";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: APP_PATHS.CHAT,
    loadChildren: () => import('./features/global-chat/global-chat.module').then(m => m.GlobalChatModule)
  },
  {
    path: APP_PATHS.BOAT,
    loadChildren: () => import('./features/battleship/battleship.module').then(m => m.BattleshipModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
