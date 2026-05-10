import { AfterViewInit, Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Directive({
  selector: '[appCharToColor]',
  standalone: true,
})
export class CharToColorDirective implements AfterViewInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly themeService = inject(ThemeService);

  appCharToColor = input<string | undefined>();

  constructor() {
    effect(() => {
      this.themeService.isDarkMode();
      this.appCharToColor();
      this.updateColor();
    });
  }

  ngAfterViewInit(): void {
    this.updateColor();
  }

  private updateColor(): void {
    const overrideColor = this.appCharToColor();
    if (overrideColor) {
      this.renderer.setStyle(this.el.nativeElement, 'color', overrideColor);
      return;
    }

    const characters = this.el.nativeElement.innerText;
    if (characters) {
      this.renderer.setStyle(this.el.nativeElement, 'color', this.stringToHexColor(characters));
    }
  }

  private stringToHexColor(str: string) {
    let r = 0;
    let g = 0;
    let b = 0;

    for (let i = 0; i < str.length; i++) {
      const charCode = str.codePointAt(i);
      if (charCode === undefined) {
        return '#000000';
      }
      r += charCode;
      g += charCode * 2;
      b += charCode * 3;
    }

    r = Math.round(r % 256);
    g = Math.round(g % 256);
    b = Math.round(b % 256);

    const isDarkMode = this.themeService.isDarkMode();
    if (isDarkMode) {
      // In dark mode, ensure the color is light enough.
      // Boost the lightness if it's too dark.
      // Using a simple weighted average to determine lightness.
      const lightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      if (lightness < 0.4) {
        r = Math.min(255, r + 100);
        g = Math.min(255, g + 100);
        b = Math.min(255, b + 100);
      }
    } else {
      // In light mode, ensure the color is dark enough.
      // Dim the color if it's too light.
      const lightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      if (lightness > 0.6) {
        r = Math.max(0, r - 100);
        g = Math.max(0, g - 100);
        b = Math.max(0, b - 100);
      }
    }

    return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
  }

  private componentToHex(c: number): string {
    return c.toString(16).padStart(2, '0');
  }

}
