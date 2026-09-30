import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SplinePreloaderService {
  private static scriptLoaded = false;
  private static scriptPromise: Promise<void> | null = null;
  private static splineCache = new Map<string, any>();

  preloadSplineScript(): Promise<void> {
    if (SplinePreloaderService.scriptLoaded) {
      return Promise.resolve();
    }

    if (SplinePreloaderService.scriptPromise) {
      return SplinePreloaderService.scriptPromise;
    }

    SplinePreloaderService.scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.48/build/spline-viewer.js';
      script.onload = () => {
        SplinePreloaderService.scriptLoaded = true;
        this.preloadSplineScene();
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return SplinePreloaderService.scriptPromise;
  }

  private preloadSplineScene(): void {
    const splineUrls = [
      'https://prod.spline.design/FQD3sUOli-WsSNzl/scene.splinecode',
      'https://prod.spline.design/p3WsfplEuFdZ23yC/scene.splinecode',
      'https://prod.spline.design/Ql7Cb17jUuCZdOqY/scene.splinecode'
    ];
    
    splineUrls.forEach(splineUrl => {
      if (!SplinePreloaderService.splineCache.has(splineUrl)) {
        fetch(splineUrl)
          .then(response => response.arrayBuffer())
          .then(data => {
            SplinePreloaderService.splineCache.set(splineUrl, data);
          })
          .catch(console.error);
      }
    });
  }

  isScriptLoaded(): boolean {
    return SplinePreloaderService.scriptLoaded;
  }

  isSplineCached(url: string): boolean {
    return SplinePreloaderService.splineCache.has(url);
  }
}