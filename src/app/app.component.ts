import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./core/components/header/header.component";
import { PageLoaderComponent } from "./core/components/page-loader/page-loader.component";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { AuthService } from "./core/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, PageLoaderComponent]
})
export class AppComponent implements OnInit {
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);
  private readonly authService = inject(AuthService);

  constructor() {
    this.matIconRegistry.addSvgIcon(
      `racoon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/racoon.svg")
    );
  }

  ngOnInit(): void {
    this.authService.initializeAuth();
  }
}
