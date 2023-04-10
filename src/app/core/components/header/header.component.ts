import { Component, Input } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title: string;

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.title = 'headerTitle';

    this.matIconRegistry.addSvgIcon(
      `racoon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/racoon.svg")
    );
  }
}
