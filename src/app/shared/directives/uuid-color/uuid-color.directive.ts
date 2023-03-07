import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[uuidColor]'
})
export class UuidColorDirective implements OnInit {
  @Input() uuidColor = '';

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    if (this.uuidColor) {
      let hash = 0;
      for (let i = 0; i < this.uuidColor.length; i++) {
        hash = this.uuidColor.charCodeAt(i) + ((hash << 5) - hash);
      }
      let colour = '#';
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).slice(-2);
      }
      this.el.nativeElement.style.color = colour;
    }
  }

}
