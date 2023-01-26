import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponentComponent } from "./features/page-not-found-component/page-not-found-component.component"; // CLI imports router

const routes: Routes = [
  {
    path: 'chat',
    loadChildren: () => import('./features/global-chat/global-chat.module').then(m => m.GlobalChatModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
