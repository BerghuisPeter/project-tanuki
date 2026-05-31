import { inject } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

export function registerTestIcons() {
  const iconRegistry = inject(MatIconRegistry);
  const sanitizer = inject(DomSanitizer);

  // Register the "racoon" icon as a mock SVG
  iconRegistry.addSvgIconLiteral(
    'racoon',
    sanitizer.bypassSecurityTrustHtml('<svg><path d="M0 0h24v24H0z" fill="none"/></svg>')
  );
}
