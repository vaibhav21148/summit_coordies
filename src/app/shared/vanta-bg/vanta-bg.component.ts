import { Component } from '@angular/core';

@Component({
  selector: 'app-vanta-bg',
  standalone: true,
  template: `
    <div class="background"></div>
    <div class="overlay"></div>
  `,
   styles: [`
  .background {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background-image: url('https://4cqs2zpl07.ucarecd.net/73b12e34-9154-4e4e-a2d9-208106176178/-/preview/1919x1260/');
    background-position: center;
    background-size: cover;
    backdrop-filter: blur(12px);
    backdrop-filter: brightness(0.6);
    background-repeat: no-repeat;
    z-index: -2;
  }

  .overlay {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 100%);
    z-index: -1;
  }

  @media (max-width: 768px) {
    .background {
      background-attachment: scroll; /* avoid iOS parallax bug */
    }
  }
  `]
})
export class VantaBgComponent {}


