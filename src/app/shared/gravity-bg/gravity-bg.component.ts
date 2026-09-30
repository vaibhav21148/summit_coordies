import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';

class Point {
  x: number; y: number;
  ox: number; oy: number;
  vx = 0; vy = 0;
  constructor(x: number, y: number) {
    this.x = x; this.y = y; this.ox = x; this.oy = y;
  }
}

@Component({
  selector: 'app-gravity-bg',
  standalone: true,
  imports: [],
  templateUrl: './gravity-bg.component.html',
  styleUrls: ['./gravity-bg.component.scss']
})
export class GravityBgComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gravityCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private points: Point[][] = [];
  private mouse = { x: -1000, y: -1000 };
  private animationFrameId: number = 0;
  private cols = 0;
  private rows = 0;
  private spacing = 60;

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.resize();
    this.animate();
  }

  @HostListener('window:resize')
  resize() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.cols = Math.floor(canvas.width / this.spacing) + 2;
    this.rows = Math.floor(canvas.height / this.spacing) + 2;
    this.points = [];
    for (let i = 0; i < this.rows; i++) {
      const row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push(new Point(j * this.spacing, i * this.spacing));
      }
      this.points.push(row);
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  @HostListener('window:mouseleave')
  onMouseLeave() {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  animate = () => {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const p = this.points[i][j];
        const dx = this.mouse.x - p.ox;
        const dy = this.mouse.y - p.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let tx = p.ox;
        let ty = p.oy;

        const radius = 250; 
        if (dist < radius) {
          const force = (radius - dist) / radius;
          tx = p.ox + (dx * force * 0.7);
          ty = p.oy + (dy * force * 0.7);
        }

        p.vx += (tx - p.x) * 0.15;
        p.vy += (ty - p.y) * 0.15;
        p.vx *= 0.65;
        p.vy *= 0.65;
        p.x += p.vx;
        p.y += p.vy;
      }
    }

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    
    for (let i = 0; i < this.rows; i++) {
      this.ctx.moveTo(this.points[i][0].x, this.points[i][0].y);
      for (let j = 1; j < this.cols; j++) {
        this.ctx.lineTo(this.points[i][j].x, this.points[i][j].y);
      }
    }
    
    for (let j = 0; j < this.cols; j++) {
      this.ctx.moveTo(this.points[0][j].x, this.points[0][j].y);
      for (let i = 1; i < this.rows; i++) {
        this.ctx.lineTo(this.points[i][j].x, this.points[i][j].y);
      }
    }
    
    this.ctx.stroke();

    if (this.mouse.x !== -1000) {
      this.ctx.globalCompositeOperation = 'destination-in';
      const gradient = this.ctx.createRadialGradient(this.mouse.x, this.mouse.y, 0, this.mouse.x, this.mouse.y, 250);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
      this.ctx.globalCompositeOperation = 'source-over'; // reset
    } else {
      this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }
}
