import { Component, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements AfterViewInit, OnDestroy {
  @Output() loadingComplete = new EventEmitter<void>();
  @ViewChild('warpCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('loadingScreen', { static: true }) loadingScreenRef!: ElementRef<HTMLDivElement>;
  @ViewChild('zoomContainer', { static: true }) zoomContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('openingImage', { static: true }) openingImageRef!: ElementRef<HTMLImageElement>;

  private animationFrameId: number | null = null;
  private isDestroyed = false;
  private startTime = 0;
  private imageFadingIn = false;

  private readonly PHASE1_DURATION = 1000;     // Warp speed
  private readonly PHASE2_DURATION = 1000;     // Gravitational lensing / swirl
  private readonly PHASE3_DURATION = 2000;     // Black hole reveal & orbiting light
  private readonly TOTAL_DURATION = this.PHASE1_DURATION + this.PHASE2_DURATION + this.PHASE3_DURATION;

  // Particles for the comet trail
  private trailParticles: { x: number, y: number, life: number, maxLife: number, size: number, vx: number, vy: number }[] = [];

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit() {
    this.startTime = performance.now();
    this.initAnimation();
  }

  ngOnDestroy() {
    this.isDestroyed = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initAnimation() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Stars
    const stars: { x: number; y: number; z: number; pz: number, angle: number, dist: number }[] = [];
    const numStars = 800;

    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * width * 2 - width;
      const y = Math.random() * height * 2 - height;
      stars.push({
        x: x,
        y: y,
        z: Math.random() * width,
        pz: Math.random() * width,
        angle: Math.atan2(y, x),
        dist: Math.sqrt(x * x + y * y)
      });
    }

    let currentSpeed = 5;

    const draw = () => {
      if (this.isDestroyed) return;

      const elapsed = performance.now() - this.startTime;
      const cx = width / 2;
      const cy = height / 2;

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(0, 0, 0, 0.3)`; // Trail effect
      ctx.fillRect(0, 0, width, height);

      // === PHASE 1: Warp Speed (0 - 1s) ===
      if (elapsed < this.PHASE1_DURATION) {
        if (currentSpeed < 45) currentSpeed += 1.5;

        ctx.strokeStyle = 'white';
        this.drawStars(ctx, stars, currentSpeed, width, height, cx, cy, 0);
      }

      // === PHASE 2: Gravitational Lensing / Swirl (1s - 2s) ===
      else if (elapsed < this.PHASE1_DURATION + this.PHASE2_DURATION) {
        const p2Elapsed = elapsed - this.PHASE1_DURATION;
        const p2Progress = p2Elapsed / this.PHASE2_DURATION; // 0 to 1

        // Speed slows down as they get caught in gravity
        currentSpeed = Math.max(2, 45 - p2Progress * 43);

        // Stars start swirling (lensing effect)
        const swirlStrength = p2Progress * 0.15; // How much they rotate per frame

        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - p2Progress * 0.5);
        ctx.strokeStyle = `rgba(200, 220, 255, 1)`;
        this.drawStars(ctx, stars, currentSpeed, width, height, cx, cy, swirlStrength);
        ctx.restore();

        // Start fading in the black hole image halfway through the swirl
        if (p2Progress > 0.5 && !this.imageFadingIn) {
          this.imageFadingIn = true;
          this.openingImageRef.nativeElement.classList.add('visible');
          // Hide canvas zoom container since we aren't using CSS zoom anymore, we just want the canvas over the image
          this.zoomContainerRef.nativeElement.style.transform = 'scale(1)';
        }
      }

      // === PHASE 3: Black Hole & Orbiting Light (2s - 4s) ===
      else if (elapsed < this.TOTAL_DURATION) {
        const p3Elapsed = elapsed - this.PHASE1_DURATION - this.PHASE2_DURATION;
        const p3Progress = p3Elapsed / this.PHASE3_DURATION; // 0 to 1

        // Clear canvas completely so the full opening.png image is visible behind the comet
        ctx.clearRect(0, 0, width, height);

        // Make the opening.png slowly visible as the white light approaches
        this.openingImageRef.nativeElement.style.opacity = Math.min(1, p3Progress * 1.5).toString();

        // As the comet plunges (progress > 0.6), the camera follows it IN violently
        if (p3Progress > 0.6) {
          const plungeProgress = (p3Progress - 0.6) / 0.4;
          // Camera massive zoom on the image
          const zoomScale = 1 + Math.pow(plungeProgress, 4) * 30;

          // Set the transform origin to the black hole's visual center in the image
          this.openingImageRef.nativeElement.style.transformOrigin = '75% 45%';
          this.openingImageRef.nativeElement.style.transform = `scale(${zoomScale})`;

          // Do NOT scale the canvas so the comet actually shrinks away from the camera
          this.zoomContainerRef.nativeElement.style.transform = 'scale(1)';
        } else {
          this.openingImageRef.nativeElement.style.transformOrigin = '75% 45%';
          this.openingImageRef.nativeElement.style.transform = 'scale(1)';
          this.zoomContainerRef.nativeElement.style.transform = 'scale(1)';
        }

        // Draw the dynamic comet flying into the black hole OVER the image
        this.drawDynamicComet(ctx, cx, cy, width, height, p3Progress);
      }

      // === Done ===
      else {
        // Clear canvas so only image remains before fade out
        ctx.clearRect(0, 0, width, height);

        if (!this.loadingScreenRef.nativeElement.classList.contains('fade-out')) {
          this.startFadeOut();
        }
      }

      this.animationFrameId = requestAnimationFrame(draw);
    };

    this.ngZone.runOutsideAngular(() => {
      draw();
    });
  }

  private drawStars(
    ctx: CanvasRenderingContext2D,
    stars: { x: number; y: number; z: number; pz: number, angle: number, dist: number }[],
    speed: number,
    width: number, height: number,
    cx: number, cy: number,
    swirl: number
  ) {
    stars.forEach(star => {
      star.z -= speed;

      // Swirl effect modifies angle based on how close to center they are
      if (swirl > 0) {
        star.angle += swirl * (1000 / Math.max(100, star.dist));
        star.x = Math.cos(star.angle) * star.dist;
        star.y = Math.sin(star.angle) * star.dist;
      }

      if (star.z <= 0) {
        star.x = Math.random() * width * 2 - width;
        star.y = Math.random() * height * 2 - height;
        star.z = width;
        star.pz = width;
        star.angle = Math.atan2(star.y, star.x);
        star.dist = Math.sqrt(star.x * star.x + star.y * star.y);
      }

      const sx = (star.x / star.z) * width + cx;
      const sy = (star.y / star.z) * height + cy;
      const px = (star.x / star.pz) * width + cx;
      const py = (star.y / star.pz) * height + cy;

      star.pz = star.z;

      ctx.lineWidth = Math.max(0.5, (1 - star.z / width) * 3);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.stroke();
    });
  }

  private drawDynamicComet(
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number,
    width: number, height: number,
    progress: number // 0 to 1
  ) {
    ctx.save();
    ctx.translate(cx, cy);

    // The trail covers a certain percentage of the path
    const trailLength = 0.45;
    const startT = Math.max(0, progress - trailLength);

    // Cubic Bezier control points for "Skimming the Rings"
    const p0 = { x: -width * 0.8, y: height * 0.8 };  // Start deep bottom-left
    const p1 = { x: width * 0.8, y: height * 0.6 };   // Shoot towards the bottom of the right ring
    const p2 = { x: width * 0.6, y: -height * 0.6 };  // Skim UP along the edge of the right ring
    const p3 = { x: width * 0.25, y: height * -0.05 }; // Bank sharply left into the dark void

    const getPoint = (t: number) => {
      const u = 1 - t;
      return {
        x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
        y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y
      };
    };

    const getTangent = (t: number) => {
      const u = 1 - t;
      const dx = 3*u*u*(p1.x - p0.x) + 6*u*t*(p2.x - p1.x) + 3*t*t*(p3.x - p2.x);
      const dy = 3*u*u*(p1.y - p0.y) + 6*u*t*(p2.y - p1.y) + 3*t*t*(p3.y - p2.y);
      return Math.atan2(dy, dx);
    };

    const numStrands = 30; // Dense strands
    const baseSpread = 7;
    const steps = 50;

    const globalFade = Math.sin(progress * Math.PI); // Fades in and out

    // Draw the multi-strand trail
    for (let i = 0; i < numStrands; i++) {
      const offset = (i - numStrands / 2) * baseSpread;
      const strandFactor = Math.abs(i - numStrands / 2) / (numStrands / 2);

      const isCore = strandFactor < 0.4;

      const baseLineWidth = Math.max(1, 4.5 - strandFactor * 3.5);

      let prevX = 0, prevY = 0;
      let hasPrev = false;

      for (let s = 0; s <= steps; s++) {
        const stepProgress = startT + (progress - startT) * (s / steps);
        if (stepProgress <= 0) continue;

        const easeT = Math.pow(stepProgress, 1.15);
        const pt = getPoint(easeT);

        // 3D Perspective Scale: As easeT approaches 1 (center), scale approaches 0 (distant)
        const zScale = Math.max(0, 1 - easeT);

        const tangent = getTangent(easeT) + Math.PI / 2;

        // Scale down the spread of the strands as it goes into the distance
        const currentOffset = offset * Math.sin((s / steps) * Math.PI) * zScale;
        const x = pt.x + Math.cos(tangent) * currentOffset;
        const y = pt.y + Math.sin(tangent) * currentOffset;

        if (hasPrev) {
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);

          const tailFade = Math.pow(s / steps, 1.5);
          const alpha = (isCore ? 1 : 0.6) * tailFade * globalFade * (1 - strandFactor);

          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = baseLineWidth * zScale; // Shrink line width in distance
          ctx.shadowColor = `rgba(255, 255, 255, ${alpha})`;
          ctx.shadowBlur = (isCore ? 15 : 20) * zScale;
          ctx.stroke();
        }

        prevX = x;
        prevY = y;
        hasPrev = true;
      }
    }

    // Draw the bright point light at the head
    if (progress > 0 && progress < 1) {
      const headEaseT = Math.pow(progress, 1.15);
      const pt = getPoint(headEaseT);
      const zScale = Math.max(0, 1 - headEaseT);

      ctx.globalAlpha = globalFade;

      // Core point
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 10 * zScale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 40 * zScale;
      ctx.fill();

      // Ambient halo (Pure white)
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 45 * zScale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = 80 * zScale;
      ctx.fill();
    }

    ctx.restore();
  }

  private startFadeOut() {
    const element = this.loadingScreenRef.nativeElement;
    element.classList.add('fade-out');

    setTimeout(() => {
      this.ngZone.run(() => {
        this.loadingComplete.emit();
      });
    }, 800);
  }
}