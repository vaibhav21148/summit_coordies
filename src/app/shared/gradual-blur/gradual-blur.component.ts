import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gradual-blur',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="gradual-blur"
      [ngStyle]="containerStyle"
    >
      <div class="relative w-full h-full">
        @for(layer of blurLayers; track layer.id) {
          <div [ngStyle]="layer.style" class="gradual-blur-layer"></div>
        }
      </div>
      @if (hasContent) {
        <div class="relative">
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    .gradual-blur {
      pointer-events: none;
    }
    .gradual-blur-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .relative {
      position: relative;
    }
    .w-full { width: 100%; }
    .h-full { height: 100%; }
  `]
})
export class GradualBlurComponent implements OnInit, OnChanges {
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  @Input() strength: number = 2;
  @Input() height: string = '6rem';
  @Input() width: string = '100%';
  @Input() divCount: number = 5;
  @Input() exponential: boolean = false;
  @Input() zIndex: number = 10;
  @Input() opacity: number = 1;
  @Input() curve: 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out' = 'linear';
  @Input() hasContent: boolean = false;

  blurLayers: { id: number; style: any }[] = [];
  containerStyle: any = {};

  ngOnInit() {
    this.calculateLayers();
  }

  ngOnChanges() {
    this.calculateLayers();
  }

  private calculateLayers() {
    const isVertical = ['top', 'bottom'].includes(this.position);
    const isHorizontal = ['left', 'right'].includes(this.position);

    this.containerStyle = {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: this.zIndex,
    };

    if (isVertical) {
      this.containerStyle.height = this.height;
      this.containerStyle.width = this.width;
      this.containerStyle.left = 0;
      this.containerStyle.right = 0;
      if (this.position === 'top') this.containerStyle.top = 0;
      if (this.position === 'bottom') this.containerStyle.bottom = 0;
    } else if (isHorizontal) {
      this.containerStyle.width = this.width || this.height; // Using height as fallback if width isn't specified for horizontal
      this.containerStyle.height = '100%';
      this.containerStyle.top = 0;
      this.containerStyle.bottom = 0;
      if (this.position === 'left') this.containerStyle.left = 0;
      if (this.position === 'right') this.containerStyle.right = 0;
    }

    const curveFunctions: Record<string, (p: number) => number> = {
      linear: p => p,
      bezier: p => p * p * (3 - 2 * p),
      'ease-in': p => p * p,
      'ease-out': p => 1 - Math.pow(1 - p, 2),
      'ease-in-out': p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
    };

    const curveFunc = curveFunctions[this.curve] || curveFunctions['linear'];
    const increment = 100 / this.divCount;
    this.blurLayers = [];

    const directions: Record<string, string> = {
      top: 'to top',
      bottom: 'to bottom',
      left: 'to left',
      right: 'to right'
    };
    const direction = directions[this.position] || 'to bottom';

    for (let i = 1; i <= this.divCount; i++) {
      let progress = i / this.divCount;
      progress = curveFunc(progress);

      let blurValue: number;
      if (this.exponential) {
        blurValue = Math.pow(2, progress * 4) * 0.0625 * this.strength;
      } else {
        blurValue = 0.0625 * (progress * this.divCount + 1) * this.strength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      this.blurLayers.push({
        id: i,
        style: {
          'mask-image': `linear-gradient(${direction}, ${gradient})`,
          '-webkit-mask-image': `linear-gradient(${direction}, ${gradient})`,
          'backdrop-filter': `blur(${blurValue.toFixed(3)}rem)`,
          '-webkit-backdrop-filter': `blur(${blurValue.toFixed(3)}rem)`,
          'opacity': this.opacity
        }
      });
    }
  }
}
