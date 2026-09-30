import { Directive, ElementRef, Renderer2, HostListener, NgZone, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appScrollStack]',
  standalone: true
})
export class ScrollStackDirective implements AfterViewInit {
  private ticking = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    // Initial setup to ensure no layout jumps
    this.renderer.setStyle(this.el.nativeElement, 'will-change', 'transform, opacity, filter');
    this.renderer.setStyle(this.el.nativeElement, 'transform-origin', '50% 100%');
    
    // Defer the first update slightly to ensure DOM is fully laid out
    setTimeout(() => this.updateAnimation(), 100);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.ticking) {
      this.ngZone.runOutsideAngular(() => {
        window.requestAnimationFrame(() => {
          this.updateAnimation();
          this.ticking = false;
        });
      });
      this.ticking = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateAnimation();
  }

  private updateAnimation() {
    if (window.innerWidth <= 768) {
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'none');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
      this.renderer.setStyle(this.el.nativeElement, 'filter', 'none');
      return;
    }

    const rect = this.el.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Top of the element relative to the viewport
    // 1.0 = bottom edge of viewport, 0.0 = top edge of viewport, negative = above viewport
    const relativeY = rect.top / windowHeight;

    let rotateX = 0;
    let scale = 1;
    let translateY = 0;
    let opacity = 1;
    let blur = 0;

    // SCROLLING UP (Element enters from bottom)
    // When element top is below 85% of the viewport height
    if (relativeY > 0.85) {
      const progress = Math.min(1, Math.max(0, (relativeY - 0.85) / 0.15)); // 0 at 0.85, 1 at 1.0+
      translateY = progress * 150; // Slide up
      opacity = 1 - progress; // Fade in
      scale = 1 - (progress * 0.05); // Start slightly smaller
    } 
    // SCROLLING DOWN (Element goes past top)
    // SCROLLING DOWN (Element goes past top)
    // When element top goes above 20% of the viewport height, start the peel effect
    else if (relativeY < 0.20) {
      // Extended scroll distance past the top of the screen
      const progress = Math.min(1, Math.max(0, (0.20 - relativeY) / 0.40)); // 0 at 0.20, 1 at -0.20
      rotateX = progress * -40; // Gentle outward tilt
      scale = 1 + (progress * 0.1); // Smooth scale up
      translateY = 0; // Keep at 0 to ensure cards stay strictly separate and don't overlap
      blur = progress * 6; // Gentle blur
      opacity = 1 - progress; // Smooth fade out
    }

    // Apply the computed styles
    const transform = `perspective(1500px) translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`;
    this.renderer.setStyle(this.el.nativeElement, 'transform', transform);
    this.renderer.setStyle(this.el.nativeElement, 'opacity', opacity.toString());
    this.renderer.setStyle(this.el.nativeElement, 'filter', blur > 0 ? `blur(${blur}px)` : 'none');
  }
}
