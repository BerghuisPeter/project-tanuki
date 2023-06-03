import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from "./app.routing";
import { HttpClientModule } from "@angular/common/http";
import { CoreModule } from "./core/core.module";
import { environment } from "../environments/environment";

const options = {
  autoConnect: false
};

const config: SocketIoConfig = { url: environment.socketNodeServerUrl, options: options };

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
