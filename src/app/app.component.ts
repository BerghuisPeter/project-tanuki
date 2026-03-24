import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./core/components/header/header.component";
import { PageLoaderComponent } from "./core/components/page-loader/page-loader.component";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, PageLoaderComponent]
})
export class AppComponent implements AfterViewInit {
  title: string = 'project-tanuki';
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly domSanitizer = inject(DomSanitizer);

  constructor() {
    this.matIconRegistry.addSvgIcon(
      `racoon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/racoon.svg")
    );
  }

  ngAfterViewInit(): void {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('fade-out');
      // Remove from DOM after transition
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }
  }
}
