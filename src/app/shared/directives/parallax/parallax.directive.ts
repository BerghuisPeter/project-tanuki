import { Directive, ElementRef, HostListener, inject, input, OnInit } from '@angular/core';

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit {
  readonly speed = input<number, string | number>(0.02, {
    alias: 'appParallax',
    transform: (v: string | number) => v === '' ? 0.02 : Number(v)
  });
  private readonly el = inject(ElementRef);

  ngOnInit() {
    this.resetParallax();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    const parallaxX = deltaX * this.speed();
    const parallaxY = deltaY * this.speed();

    this.el.nativeElement.style.setProperty('--parallax-x', `${parallaxX}px`);
    this.el.nativeElement.style.setProperty('--parallax-y', `${parallaxY}px`);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.resetParallax();
  }

  private resetParallax() {
    this.el.nativeElement.style.setProperty('--parallax-x', '0px');
    this.el.nativeElement.style.setProperty('--parallax-y', '0px');
  }
}
