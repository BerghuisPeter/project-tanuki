import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from "@angular/material/toolbar";
import { AppRoutingModule } from "./app.routing";
import { PageNotFoundComponentComponent } from './features/page-not-found-component/page-not-found-component.component';
import { LoadingComponent } from './shared/components/loading/loading.component';

const options = {
  autoConnect: false,
  query: { userName: 'testUser' }
};

const config: SocketIoConfig = { url: 'http://localhost:4444', options: options };

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponentComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
