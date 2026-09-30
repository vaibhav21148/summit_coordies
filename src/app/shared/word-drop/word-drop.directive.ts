import { Directive, ElementRef, AfterViewInit, OnDestroy, NgZone, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appWordDrop]',
  standalone: true,
})
export class WordDropDirective implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private initDone = false;

  constructor(
    private el: ElementRef,
    private zone: NgZone,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.init());
    });
  }

  private init() {
    const element = this.el.nativeElement as HTMLElement;
    const text = element.textContent?.trim() || '';
    if (!text) return;

    const gradient = 'linear-gradient(180deg, #FF7A1A 45.48%, #ffffff 81.9%)';

    // Inject keyframe animation into document head (once)
    if (!document.getElementById('word-drop-keyframes')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'word-drop-keyframes';
      styleEl.textContent = `
        @keyframes charDropIn {
          0% {
            opacity: 0;
            transform: translateY(35px);
          }
          60% {
            opacity: 1;
            transform: translateY(-4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(styleEl);
    }

    // Build character spans
    element.innerHTML = '';

    // Remove gradient from parent
    element.style.background = 'none';
    element.style.setProperty('-webkit-background-clip', 'unset');
    element.style.setProperty('background-clip', 'unset');
    element.style.setProperty('-webkit-text-fill-color', 'unset');

    let charIndex = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      if (char === ' ') {
        element.appendChild(document.createTextNode('\u00A0'));
        continue;
      }

      const span = document.createElement('span');
      span.textContent = char;
      span.style.cssText = `
        display: inline-block;
        opacity: 0;
        background: ${gradient};
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
      `;
      span.dataset['charIdx'] = String(charIndex);
      span.classList.add('char-drop-item');
      element.appendChild(span);
      charIndex++;
    }

    this.initDone = true;

    // Observe the heading element itself, not the parent section,
    // otherwise very tall sections will never meet the visibility threshold.
    const observeTarget = element;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && this.initDone) {
          const chars = element.querySelectorAll('.char-drop-item') as NodeListOf<HTMLElement>;
          chars.forEach((charEl) => {
            const idx = parseInt(charEl.dataset['charIdx'] || '0', 10);
            charEl.style.animation = `charDropIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.06}s forwards`;
          });
          this.observer?.disconnect();
        }
      });
    }, {
      threshold: 0.1, // Trigger as soon as 10% of the heading is visible
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before it fully enters from bottom
    });

    this.observer.observe(observeTarget);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
