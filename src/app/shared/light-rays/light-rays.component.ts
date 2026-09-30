import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

const hexToRgb = (hex: string) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const getAnchorAndDir = (origin: string, w: number, h: number) => {
  const outside = 0.2;
  switch (origin) {
    case 'top-left':
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case 'top-right':
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case 'left':
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case 'right':
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case 'bottom-left':
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-center':
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-right':
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default: // "top-center"
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

@Component({
  selector: 'app-light-rays',
  standalone: true,
  imports: [CommonModule],
  template: '<div #container class="light-rays-container" [ngClass]="className"></div>',
  styleUrl: './light-rays.component.scss'
})
export class LightRaysComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() raysOrigin: string = 'top-center';
  @Input() raysColor: string = '#ffffff';
  @Input() raysSpeed: number = 1;
  @Input() lightSpread: number = 1;
  @Input() rayLength: number = 2;
  @Input() pulsating: boolean = false;
  @Input() fadeDistance: number = 1.0;
  @Input() saturation: number = 1.0;
  @Input() followMouse: boolean = true;
  @Input() mouseInfluence: number = 0.1;
  @Input() noiseAmount: number = 0.0;
  @Input() distortion: number = 0.0;
  @Input() lightMode: boolean = false;
  @Input() className: string = '';

  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  private renderer: any;
  private uniforms: any;
  private mesh: any;
  private animationId: number | null = null;
  private mouse = { x: 0.5, y: 0.5 };
  private smoothMouse = { x: 0.5, y: 0.5 };
  private isVisible = false;
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        this.isVisible = entry.isIntersecting;
        if (this.isVisible && !this.renderer) {
          this.initWebGL();
        }
      },
      { threshold: 0.1 }
    );
    this.observer.observe(this.containerRef.nativeElement);

    if (this.followMouse) {
      window.addEventListener('mousemove', this.onMouseMove);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateUniforms();
  }

  ngOnDestroy() {
    this.cleanup();
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.containerRef || !this.renderer) return;
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    this.mouse = { x, y };
  };

  private async initWebGL() {
    const ogl = await import('ogl');
    if (!this.containerRef) return;

    this.renderer = new ogl.Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true
    });

    const gl = this.renderer.gl;
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';

    const container = this.containerRef.nativeElement;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(gl.canvas);

    const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

    const frag = `precision highp float;
uniform float iTime;
uniform vec2  iResolution;
uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;
uniform float lightMode;
varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;

  if (lightMode > 0.5) {
    vec3 mapped = vec3(1.0) - exp(-max(fragColor.rgb, vec3(0.0)) * 1.35);
    float energy = clamp(max(mapped.r, max(mapped.g, mapped.b)), 0.0, 1.0);
    vec3 hue = mapped / max(energy, 0.0001);
    vec3 ink = mix(hue * 0.25, hue * 0.72, energy);
    fragColor = vec4(mix(vec3(1.0), ink, energy), 1.0);
  }
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}`;

    this.uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      rayPos: { value: [0, 0] },
      rayDir: { value: [0, 1] },
      raysColor: { value: hexToRgb(this.raysColor) },
      raysSpeed: { value: this.raysSpeed },
      lightSpread: { value: this.lightSpread },
      rayLength: { value: this.rayLength },
      pulsating: { value: this.pulsating ? 1.0 : 0.0 },
      fadeDistance: { value: this.fadeDistance },
      saturation: { value: this.saturation },
      mousePos: { value: [0.5, 0.5] },
      mouseInfluence: { value: this.mouseInfluence },
      noiseAmount: { value: this.noiseAmount },
      distortion: { value: this.distortion },
      lightMode: { value: this.lightMode ? 1.0 : 0.0 }
    };

    const geometry = new ogl.Triangle(gl);
    const program = new ogl.Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: this.uniforms
    });
    this.mesh = new ogl.Mesh(gl, { geometry, program });

    window.addEventListener('resize', this.updatePlacement);
    this.updatePlacement();
    
    const loop = (t: number) => {
      if (!this.renderer || !this.uniforms || !this.mesh) return;

      this.uniforms.iTime.value = t * 0.001;

      if (this.followMouse && this.mouseInfluence > 0.0) {
        const smoothing = 0.92;
        this.smoothMouse.x = this.smoothMouse.x * smoothing + this.mouse.x * (1 - smoothing);
        this.smoothMouse.y = this.smoothMouse.y * smoothing + this.mouse.y * (1 - smoothing);
        this.uniforms.mousePos.value = [this.smoothMouse.x, this.smoothMouse.y];
      }

      try {
        this.renderer.render({ scene: this.mesh });
        this.animationId = requestAnimationFrame(loop);
      } catch (error) {
        console.warn('WebGL rendering error:', error);
      }
    };

    this.animationId = requestAnimationFrame(loop);
  }

  private updatePlacement = () => {
    if (!this.containerRef || !this.renderer) return;

    this.renderer.dpr = Math.min(window.devicePixelRatio, 2);
    const container = this.containerRef.nativeElement;
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    const dpr = this.renderer.dpr;
    const w = container.clientWidth * dpr;
    const h = container.clientHeight * dpr;

    this.uniforms.iResolution.value = [w, h];

    const { anchor, dir } = getAnchorAndDir(this.raysOrigin, w, h);
    this.uniforms.rayPos.value = anchor;
    this.uniforms.rayDir.value = dir;
  };

  private updateUniforms() {
    if (!this.uniforms || !this.containerRef || !this.renderer) return;

    this.uniforms.raysColor.value = hexToRgb(this.raysColor);
    this.uniforms.raysSpeed.value = this.raysSpeed;
    this.uniforms.lightSpread.value = this.lightSpread;
    this.uniforms.rayLength.value = this.rayLength;
    this.uniforms.pulsating.value = this.pulsating ? 1.0 : 0.0;
    this.uniforms.fadeDistance.value = this.fadeDistance;
    this.uniforms.saturation.value = this.saturation;
    this.uniforms.mouseInfluence.value = this.mouseInfluence;
    this.uniforms.noiseAmount.value = this.noiseAmount;
    this.uniforms.distortion.value = this.distortion;
    this.uniforms.lightMode.value = this.lightMode ? 1.0 : 0.0;

    const container = this.containerRef.nativeElement;
    const dpr = this.renderer.dpr;
    const { anchor, dir } = getAnchorAndDir(this.raysOrigin, container.clientWidth * dpr, container.clientHeight * dpr);
    this.uniforms.rayPos.value = anchor;
    this.uniforms.rayDir.value = dir;
  }

  private cleanup() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    window.removeEventListener('resize', this.updatePlacement);

    if (this.renderer) {
      try {
        const gl = this.renderer.gl;
        const loseContextExt = gl.getExtension('WEBGL_lose_context');
        if (loseContextExt) {
          loseContextExt.loseContext();
        }
        if (gl.canvas && gl.canvas.parentNode) {
          gl.canvas.parentNode.removeChild(gl.canvas);
        }
      } catch (e) {}
    }

    this.renderer = null;
    this.uniforms = null;
    this.mesh = null;
  }
}
