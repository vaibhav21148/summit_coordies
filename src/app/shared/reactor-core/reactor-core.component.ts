import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reactor-core',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reactor-core.component.html',
  styleUrl: './reactor-core.component.scss',
})
export class ReactorCoreComponent implements OnInit {

  // --- Radial Trace Field (38 spokes) ---
  spokes: { angle: number; length: number; width: number; color: string }[] = [];

  // --- Peripheral Satellite Network (48 nodes) ---
  satellites: { cx: number; cy: number; r: number; type: string; animClass: string; rotating: boolean; pulsing: boolean }[] = [];

  // --- Background Support Field ---
  bgEllipses: { rx: number; ry: number; rotation: number; opacity: number; color: string; dasharray: string; animDur: string }[] = [];
  bgArcs: { d: string; opacity: number; color: string; width: number; animDur: string }[] = [];

  // --- Shutter positions (degrees on inner ring) ---
  shutters: { angle: number; w: number; h: number }[] = [];

  ngOnInit() {
    this.generateSpokes();
    this.generateSatellites();
    this.generateBackground();
    this.generateShutters();
  }

  private generateSpokes() {
    const colors = ['#FFB400', '#FF8A00', '#993300'];
    let angle = 0;
    for (let i = 0; i < 38; i++) {
      const gap = 8 + Math.random() * 14; // 8° to 22°
      angle += gap;
      const lengths = [150, 250, 320];
      const widths = [0.5, 1, 1.5];
      const r = Math.random();
      const color = r < 0.2 ? colors[0] : r < 0.5 ? colors[1] : colors[2];
      this.spokes.push({
        angle: angle % 360,
        length: lengths[Math.floor(Math.random() * 3)],
        width: widths[Math.floor(Math.random() * 3)],
        color
      });
    }
  }

  private generateSatellites() {
    const types = ['circle', 'target', 'partial'];
    for (let i = 0; i < 48; i++) {
      const dist = 320 + Math.random() * 160;
      const angle = Math.random() * Math.PI * 2;
      const r = 2 + Math.random() * 6;
      const type = types[Math.floor(Math.random() * 3)];
      const rotating = i < 28;
      const pulsing = i >= 41; // last 7 nodes pulse
      this.satellites.push({
        cx: 500 + Math.cos(angle) * dist,
        cy: 500 + Math.sin(angle) * dist,
        r,
        type,
        animClass: rotating ? 'sat-rotate' : 'sat-static',
        rotating,
        pulsing
      });
    }
  }

  private generateBackground() {
    const colors = ['#1A0000', '#993300'];
    for (let i = 0; i < 18; i++) {
      const rx = 200 + Math.random() * 150;
      const ry = 80 + Math.random() * 120;
      const rotation = Math.random() * 360;
      this.bgEllipses.push({
        rx, ry, rotation,
        opacity: 0.1 + Math.random() * 0.15,
        color: colors[Math.floor(Math.random() * 2)],
        dasharray: `${40 + Math.random() * 200} ${100 + Math.random() * 300}`,
        animDur: `${80 + Math.random() * 220}s`
      });
    }

    // Partial arcs
    for (let i = 0; i < 12; i++) {
      const r = 180 + Math.random() * 280;
      const startAngle = Math.random() * 360;
      const sweep = 200 + Math.random() * 120; // 55-85% of circle
      const endAngle = startAngle + sweep;
      const sa = (startAngle * Math.PI) / 180;
      const ea = (endAngle * Math.PI) / 180;
      const x1 = 500 + Math.cos(sa) * r;
      const y1 = 500 + Math.sin(sa) * r;
      const x2 = 500 + Math.cos(ea) * r;
      const y2 = 500 + Math.sin(ea) * r;
      const largeArc = sweep > 180 ? 1 : 0;
      this.bgArcs.push({
        d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
        opacity: 0.08 + Math.random() * 0.12,
        color: colors[Math.floor(Math.random() * 2)],
        width: 0.5 + Math.random() * 1.5,
        animDur: `${100 + Math.random() * 200}s`
      });
    }
  }

  private generateShutters() {
    const angles = [30, 60, 90, 135, 180, 225, 270, 315];
    const sizes: [number, number][] = [[8, 10], [6, 12], [8, 10], [6, 12], [8, 10], [6, 12], [8, 10], [6, 12]];
    angles.forEach((angle, i) => {
      this.shutters.push({ angle, w: sizes[i][0], h: sizes[i][1] });
    });
  }

  getSpokeEndX(spoke: { angle: number; length: number }): number {
    return 500 + Math.cos((spoke.angle * Math.PI) / 180) * spoke.length;
  }

  getSpokeEndY(spoke: { angle: number; length: number }): number {
    return 500 + Math.sin((spoke.angle * Math.PI) / 180) * spoke.length;
  }

  getShutterX(shutter: { angle: number }): number {
    return 500 + Math.cos((shutter.angle * Math.PI) / 180) * 130 - 4;
  }

  getShutterY(shutter: { angle: number }): number {
    return 500 + Math.sin((shutter.angle * Math.PI) / 180) * 130 - 5;
  }
}
