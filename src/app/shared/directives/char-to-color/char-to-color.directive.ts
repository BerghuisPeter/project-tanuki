import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[charToColor]'
})
export class CharToColorDirective implements AfterViewInit {

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    const characters = this.el.nativeElement.innerText;
    if (characters) {
      this.el.nativeElement.style.color = this.stringToHexColor(characters);
    }
  }

  private stringToHexColor(str: string) {
    let r = 0;
    let g = 0;
    let b = 0;

    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      r += charCode;
      g += charCode * 2;
      b += charCode * 3;
    }

    r = Math.round(r % 256);
    g = Math.round(g % 256);
    b = Math.round(b % 256);

    return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
  }

  private componentToHex(c: number): string {
    return c.toString(16).padStart(2, '0');
  }

}
