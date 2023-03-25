import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from "./features/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: 'chat',
    loadChildren: () => import('./features/global-chat/global-chat.module').then(m => m.GlobalChatModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'boat',
    loadChildren: () => import('./features/battleship/battleship.module').then(m => m.BattleshipModule)
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
