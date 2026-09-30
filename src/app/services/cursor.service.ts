import { Injectable } from '@angular/core';

declare const TweenMax: any;

@Injectable({
  providedIn: 'root'
})
export class CursorService {
  private cursor!: HTMLElement;
  private cursorPoint!: HTMLElement;
  private cursorIn!: HTMLElement;
  private showed = false;
  private size = 50;
  private created = false;

  init() {
    if (typeof window === 'undefined') return;
    
    this.createCursor();
    this.create();
  }

  private createCursor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);

    this.cursorIn = document.createElement('div');
    this.cursorIn.className = 'custom-cursor__inner';
    this.cursor.appendChild(this.cursorIn);

    this.cursorPoint = document.createElement('div');
    this.cursorPoint.className = 'custom-cursor__point';
    document.body.appendChild(this.cursorPoint);

    this.setCursorStyles();
  }

  private setCursorStyles() {
    // Main cursor styles
    Object.assign(this.cursor.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: `${this.size}px`,
      height: `${this.size}px`,
      border: '0 solid rgba(255,255,255,0.4)',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '10000',
      opacity: '0',
      transform: `translate(${window.innerWidth/2 - this.size/2}px, ${window.innerHeight/2 - this.size/2}px)`
    });

    // Inner cursor styles
    Object.assign(this.cursorIn.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1fad8c, #83b340)',
      borderRadius: '50%'
    });

    // Point cursor styles
    Object.assign(this.cursorPoint.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '4px',
      height: '4px',
      border: '0 solid rgba(255,255,255,1)',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '10000',
      opacity: '0',
      transform: `translate(${window.innerWidth/2 - 2}px, ${window.innerHeight/2 - 2}px)`
    });
  }

  private create() {
    if (this.created) return;
    this.created = true;

    document.body.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    document.body.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.body.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    document.body.addEventListener('mouseover', this.onMouseOver.bind(this));
    
    this.show();
  }

  private destroy() {
    if (!this.created) return;
    this.created = false;

    document.body.removeEventListener('mouseenter', this.onMouseEnter.bind(this));
    document.body.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.body.removeEventListener('mouseleave', this.onMouseLeave.bind(this));
    document.body.removeEventListener('mouseover', this.onMouseOver.bind(this));
    
    this.hide();
  }

  private onMouseEnter(e: MouseEvent) {
    this.show();
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.showed) this.show();
    
    if (typeof TweenMax !== 'undefined') {
      TweenMax.to(this.cursor, 1, {
        x: e.clientX - this.size/2,
        y: e.clientY - this.size/2,
        width: this.size,
        height: this.size,
        opacity: this.size/50,
        ease: (window as any).Power2?.easeOut
      });

      TweenMax.to(this.cursorPoint, 0.5, {
        x: e.clientX - 2,
        y: e.clientY - 2,
        opacity: this.size === 50 ? 1 : 0,
        ease: (window as any).Power2?.easeOut
      });
    }
  }

  private onMouseLeave(e: MouseEvent) {
    this.hide();
  }

  private onMouseOver(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const isClickable = target.tagName === 'A' || 
                       target.tagName === 'BUTTON' ||
                       target.classList.contains('clickable');
    
    this.size = isClickable ? 0 : 50;
  }

  private show() {
    this.showed = true;
    
    if (typeof TweenMax !== 'undefined') {
      TweenMax.to(this.cursor, 1, {
        width: this.size,
        height: this.size,
        borderWidth: '1px',
        opacity: 1,
        ease: (window as any).Power2?.easeOut
      });

      TweenMax.to(this.cursorPoint, 0.5, {
        borderWidth: '2px',
        opacity: 1,
        ease: (window as any).Power2?.easeOut
      });
    }
  }

  private hide() {
    this.showed = false;
    
    if (typeof TweenMax !== 'undefined') {
      TweenMax.to(this.cursor, 1, {
        width: 0,
        height: 0,
        borderWidth: '0px',
        opacity: 0,
        ease: (window as any).Power2?.easeOut
      });

      TweenMax.to(this.cursorPoint, 0.5, {
        borderWidth: '0px',
        opacity: 0,
        ease: (window as any).Power2?.easeOut
      });
    }
  }

  update() {
    if (window.innerWidth < 1024) {
      if (this.created) this.destroy();
    } else {
      if (!this.created) this.create();
    }
  }
}