import { Component, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-comet-card',
  standalone: true,
  imports: [],
  templateUrl: './comet-card.component.html',
  styleUrl: './comet-card.component.scss'
})

export class CometCardComponent {
  @Input() rotateDepth: number = 17.5;
  @Input() translateDepth: number = 20;

  @ViewChild('card', { static: true }) cardRef!: ElementRef<HTMLDivElement>;
  @ViewChild('glare', { static: true }) glareRef!: ElementRef<HTMLDivElement>;

  constructor(private renderer: Renderer2) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const card = this.cardRef.nativeElement;
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;

    // Tilt
    const rotateX = -(yPct * this.rotateDepth);
    const rotateY = xPct * this.rotateDepth;
    const translateX = xPct * this.translateDepth;
    const translateY = -yPct * this.translateDepth;

    this.renderer.setStyle(
      card,
      'transform',
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${translateX}px) translateY(${translateY}px)`
    );

    // Glare
    const glareX = x / rect.width * 100;
    const glareY = y / rect.height * 100;
    this.renderer.setStyle(
      this.glareRef.nativeElement,
      'background',
      `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.9) 10%, rgba(255,255,255,0.75) 20%, rgba(255,255,255,0) 80%)`
    );
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    const card = this.cardRef.nativeElement;
    this.renderer.setStyle(card, 'transform', 'rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px)');
  }
}
