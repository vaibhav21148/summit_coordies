import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Input, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uFlowDir;
uniform float uPulseSpeed;
uniform float uPulseLength;
uniform float uPulseBlend;
uniform float uPulseWidth;
uniform float uCableCount;
uniform float uThickness;
uniform float uRimWidth;
uniform float uWaviness;
uniform float uSway;
uniform float uSize;
uniform vec2 uCenter;
uniform vec2 uMouseOffset;
uniform float uGlow;
uniform float uFadeNear;
uniform float uFadeFar;
uniform float uBrightness;
uniform float uColorVariance;
uniform float uOpacity;
uniform vec3 uCableColor;
uniform vec3 uPulseColor;
uniform vec3 uTunnelColor;
uniform float uTunnelOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uLightMode;
out vec4 fragColor;

void mainImage(out vec4 o, in vec2 fragCoord) {
  float size = uSize * 2.0;
  float flowDir = uFlowDir;
  float speedBase = uSpeed * 4.0 * flowDir;
  float waviness = uWaviness * 0.15;
  float rotationOsc = uSway * 0.5;
  float baseThick = uThickness * 0.35 + 0.05;
  float borderWeight = uRimWidth * 0.15 + 0.01;
  float cablesCount = floor(uCableCount);

  vec2 res = iResolution.xy;
  vec2 uv = (fragCoord - 0.5 * res) / min(res.y, res.x);
  uv -= (uCenter + uMouseOffset);
  uv /= (size + 0.0001);

  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  float depth = -log(r + 0.0001);

  float swing = sin(iTime * (uSpeed * 0.5 + 0.1)) * rotationOsc;
  float waveOffset = sin(depth * 1.2 + iTime * speedBase * 0.25) * waviness;

  float angleNormalized = (angle / 6.2831853) + 0.5;
  float finalAngle = fract(angleNormalized + waveOffset + swing);

  float cableID = floor(finalAngle * cablesCount);
  float gvX = (fract(finalAngle * cablesCount) - 0.5);

  float rand = fract(sin(cableID * 12.9898) * 43758.5453);
  float randSpeed = (0.4 + rand * 0.6) * speedBase * uPulseSpeed;
  float cableThick = baseThick * (0.6 + rand * 0.4);

  vec3 cableCol = uCableColor;
  cableCol *= 1.0 + (rand - 0.5) * 0.4 * uColorVariance;
  cableCol = mix(cableCol, uPulseColor, rand * 0.25 * uColorVariance);

  float scroll = depth + (iTime * randSpeed);
  float pulseFact = fract(scroll);

  float distToCore = abs(gvX);
  float wireMask = smoothstep(cableThick, cableThick - 0.05, distToCore);
  float rimGlow = smoothstep(borderWeight, 0.0, abs(distToCore - cableThick));

  float pulseThick = cableThick * uPulseWidth;
  float pulseMask = smoothstep(pulseThick, pulseThick - 0.05 * uPulseWidth, distToCore);

  float pulseDist = abs(pulseFact - 0.5);
  float pulseTotal = uPulseLength;
  float pulseCore = pulseTotal * (1.0 - uPulseBlend);
  float pulseLo = min(pulseCore, pulseTotal - max(fwidth(scroll), 1e-4));
  float dataPulse = 1.0 - smoothstep(pulseLo, pulseTotal, pulseDist);

  float aBody = wireMask * uTunnelOpacity;
  float aRim = rimGlow;
  float aPulse = clamp(dataPulse * pulseMask, 0.0, 1.0);

  vec3 fiberCol = uTunnelColor * aBody
    + cableCol * aRim * 1.3 * uGlow
    + uPulseColor * dataPulse * 3.0 * pulseMask;

  float distFade = smoothstep(0.0, uFadeNear, r) * smoothstep(uFadeFar, uFadeFar - 0.9, r);
  float inten = clamp(aBody + aRim + aPulse, 0.0, 1.0) * distFade;

  vec3 finalCol = fiberCol * uBrightness;
  float alpha = clamp(inten, 0.0, 1.0) * uOpacity;
  vec3 outRgb = finalCol * alpha;

  if (uGrain > 0.5) {
    float gv = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453) - 0.5) * uGrainIntensity;
    outRgb = clamp(outRgb + gv, 0.0, 1.0);
    alpha = clamp(alpha + gv, 0.0, 1.0);
  }

  o = vec4(outRgb, alpha);
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  if (uLightMode > 0.5) {
    float peak = max(o.r, max(o.g, o.b));
    vec3 chroma = pow(clamp(o.rgb / max(peak, 0.0001), 0.0, 1.0), vec3(1.16));
    fragColor = vec4(mix(vec3(1.0), chroma, o.a * 0.95), 1.0);
  } else {
    fragColor = o;
  }
}
`;

@Component({
  selector: 'app-light-tunnel',
  standalone: true,
  imports: [CommonModule],
  template: '<div #container class="light-tunnel-container"></div>',
  styleUrls: ['./light-tunnel.component.scss']
})
export class LightTunnelComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  @Input() cableColor: string = '#FFFFFF'; // E-Summit Orange
  @Input() pulseColor: string = '#FF7A1A';
  @Input() tunnelColor: string = '#000000';
  @Input() tunnelOpacity: number = 0;
  @Input() speed: number = 0.1;
  @Input() flowDirection: 'inward' | 'outward' = 'outward';
  @Input() pulseSpeed: number = 2;
  @Input() pulseLength: number = 0.28;
  @Input() pulseBlend: number = 1;
  @Input() pulseWidth: number = 1;
  @Input() cableCount: number = 20;
  @Input() thickness: number = 0.35;
  @Input() rimWidth: number = 0.15;
  @Input() waviness: number = 0.3;
  @Input() sway: number = 0.5;
  @Input() size: number = 1.0;
  @Input() centerX: number = 0.0;
  @Input() centerY: number = 0.0;
  @Input() glow: number = 1.0;
  @Input() fadeNear: number = 0.5;
  @Input() fadeFar: number = 2;
  @Input() brightness: number = 1.0;
  @Input() colorVariance: boolean = true;
  @Input() grain: boolean = true;
  @Input() grainIntensity: number = 0.05;
  @Input() opacity: number = 1.0;
  @Input() mouseInteraction: boolean = true;
  @Input() mouseStrength: number = 0.1;
  @Input() lightMode: boolean = false;

  private renderer: any;
  private program: any;
  private mesh: any;
  private gl: any;
  private ro!: ResizeObserver;
  private io!: IntersectionObserver;
  private currentMouse = [0.5, 0.5];
  private targetMouse = [0.5, 0.5];
  private raf = 0;
  private isVisible = true;
  private isPageVisible = true;
  private isBrowser: boolean;
  private loopFn: (t: number) => void = () => { };

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    import('ogl').then(({ Renderer, Program, Mesh, Triangle }) => {
      const container = this.containerRef.nativeElement;

      this.renderer = new Renderer({
        webgl: 2,
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });

      this.gl = this.renderer.gl;
      this.gl.clearColor(0, 0, 0, 0);
      const canvas = this.gl.canvas;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      container.appendChild(canvas);

      const geometry = new Triangle(this.gl);
      this.program = new Program(this.gl, {
        vertex,
        fragment,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new Float32Array([1, 1]) },
          uSpeed: { value: 0.1 },
          uFlowDir: { value: -1.0 },
          uPulseSpeed: { value: 2.0 },
          uPulseLength: { value: 0.28 },
          uPulseBlend: { value: 1.0 },
          uPulseWidth: { value: 1.0 },
          uCableCount: { value: 20 },
          uThickness: { value: 0.35 },
          uRimWidth: { value: 0.15 },
          uWaviness: { value: 0.3 },
          uSway: { value: 0.5 },
          uSize: { value: 1.0 },
          uCenter: { value: new Float32Array([0, 0]) },
          uMouseOffset: { value: new Float32Array([0, 0]) },
          uGlow: { value: 1.0 },
          uFadeNear: { value: 0.5 },
          uFadeFar: { value: 2.0 },
          uBrightness: { value: 1.0 },
          uColorVariance: { value: 1.0 },
          uOpacity: { value: 1.0 },
          uCableColor: { value: new Float32Array([0.65882353, 0.33333333, 0.96862745]) },
          uPulseColor: { value: new Float32Array([0.65882353, 0.33333333, 0.96862745]) },
          uTunnelColor: { value: new Float32Array([0.32156863, 0.15294118, 1]) },
          uTunnelOpacity: { value: 0.0 },
          uGrain: { value: 1.0 },
          uGrainIntensity: { value: 0.05 },
          uLightMode: { value: 0.0 }
        }
      });

      this.mesh = new Mesh(this.gl, { geometry, program: this.program });
      this.applyInputs();

      const setSize = () => {
        const rect = container.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect.width));
        const h = Math.max(1, Math.floor(rect.height));
        this.renderer.setSize(w, h);
        if (this.program) {
          const res = this.program.uniforms.iResolution.value;
          res[0] = this.gl.drawingBufferWidth;
          res[1] = this.gl.drawingBufferHeight;
        }
        this.renderer.render({ scene: this.mesh });
      };

      this.ro = new ResizeObserver(setSize);
      this.ro.observe(container);
      setSize();

      canvas.addEventListener('mousemove', this.handleMouseMove);
      canvas.addEventListener('mouseleave', this.handleMouseLeave);

      const t0 = performance.now();

      this.loopFn = (t: number) => {
        if (!this.program) return;
        this.program.uniforms.iTime.value = (t - t0) * 0.001;

        if (this.mouseInteraction) {
          this.currentMouse[0] += 0.05 * (this.targetMouse[0] - this.currentMouse[0]);
          this.currentMouse[1] += 0.05 * (this.targetMouse[1] - this.currentMouse[1]);
        } else {
          this.currentMouse[0] += 0.05 * (0.5 - this.currentMouse[0]);
          this.currentMouse[1] += 0.05 * (0.5 - this.currentMouse[1]);
        }
        const off = this.program.uniforms.uMouseOffset.value;
        off[0] = (this.currentMouse[0] - 0.5) * this.mouseStrength;
        off[1] = (this.currentMouse[1] - 0.5) * this.mouseStrength;

        this.renderer.render({ scene: this.mesh });
        this.raf = requestAnimationFrame(this.loopFn);
      };

      this.io = new IntersectionObserver(
        ([entry]) => {
          this.isVisible = entry.isIntersecting;
          this.isVisible ? this.tryStart() : this.tryStop();
        },
        { threshold: 0 }
      );
      this.io.observe(container);

      document.addEventListener('visibilitychange', this.onVisibility);

      this.tryStart();
    });
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.gl) return;
    const rect = this.gl.canvas.getBoundingClientRect();
    this.targetMouse = [
      (e.clientX - rect.left) / rect.width,
      1.0 - (e.clientY - rect.top) / rect.height
    ];
  };

  private handleMouseLeave = () => {
    this.targetMouse = [0.5, 0.5];
  };

  private onVisibility = () => {
    this.isPageVisible = !document.hidden;
    if (this.isPageVisible) {
      if (this.isVisible && this.raf === 0 && this.program) {
        this.tryStart();
      }
    } else {
      this.tryStop();
    }
  };

  private tryStart() {
    if (this.isVisible && this.isPageVisible && this.raf === 0) {
      this.raf = requestAnimationFrame(this.loopFn);
    }
  }

  private tryStop() {
    if (this.raf !== 0) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.applyInputs();
  }

  private applyInputs() {
    if (!this.program) return;
    const u = this.program.uniforms;
    u.uSpeed.value = this.speed;
    u.uFlowDir.value = this.flowDirection === 'outward' ? -1.0 : 1.0;
    u.uPulseSpeed.value = this.pulseSpeed;
    u.uPulseLength.value = this.pulseLength;
    u.uPulseBlend.value = this.pulseBlend;
    u.uPulseWidth.value = this.pulseWidth;
    u.uCableCount.value = this.cableCount;
    u.uThickness.value = this.thickness;
    u.uRimWidth.value = this.rimWidth;
    u.uWaviness.value = this.waviness;
    u.uSway.value = this.sway;
    u.uSize.value = this.size;

    const center = u.uCenter.value;
    center[0] = this.centerX;
    center[1] = this.centerY;

    u.uGlow.value = this.glow;
    u.uFadeNear.value = this.fadeNear;
    u.uFadeFar.value = this.fadeFar;
    u.uBrightness.value = this.brightness;
    u.uColorVariance.value = this.colorVariance ? 1.0 : 0.0;
    u.uGrain.value = this.grain ? 1.0 : 0.0;
    u.uGrainIntensity.value = this.grainIntensity;
    u.uOpacity.value = this.opacity;
    u.uLightMode.value = this.lightMode ? 1.0 : 0.0;

    const cable = hexToRgb(this.cableColor);
    const cableU = u.uCableColor.value;
    cableU[0] = cable[0]; cableU[1] = cable[1]; cableU[2] = cable[2];

    const pulse = hexToRgb(this.pulseColor);
    const pulseU = u.uPulseColor.value;
    pulseU[0] = pulse[0]; pulseU[1] = pulse[1]; pulseU[2] = pulse[2];

    const tunnel = hexToRgb(this.tunnelColor);
    const tunnelU = u.uTunnelColor.value;
    tunnelU[0] = tunnel[0]; tunnelU[1] = tunnel[1]; tunnelU[2] = tunnel[2];

    u.uTunnelOpacity.value = this.tunnelOpacity;
  }

  ngOnDestroy() {
    if (!this.isBrowser) return;
    this.tryStop();
    if (this.ro) this.ro.disconnect();
    if (this.io) this.io.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);

    if (this.gl) {
      this.gl.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.gl.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
      try {
        this.containerRef.nativeElement.removeChild(this.gl.canvas);
      } catch (e) { }
      this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  }
}
