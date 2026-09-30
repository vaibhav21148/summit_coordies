import { Component, OnInit } from '@angular/core';
import {
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoadingService } from '@services/loading.service';
import { FabComponent } from './components/fab/fab.component';
import { LoadingComponent } from './shared/loading/loading.component';

import { MetaService } from '@services/meta.service';
import { FullScreenNavbarComponent } from './shared/full-screen-navbar/full-screen-navbar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

type ValidEvents =
  | NavigationStart
  | NavigationEnd
  | NavigationCancel
  | NavigationError;
function isValidEvent(event: any): event is ValidEvents {
  return (
    event instanceof NavigationStart ||
    event instanceof NavigationEnd ||
    event instanceof NavigationCancel ||
    event instanceof NavigationError
  );
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FabComponent, LoadingComponent, FullScreenNavbarComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'esummit_25';
  showFab = true;
  disabled_index_loader = false;
  showSplineBackground = false;

  HIDE_FAB_ROUTES = ['/login', '/register', '/pass'];

  constructor(
    private router: Router,
    private loading: LoadingService,
    private meta: MetaService
  ) {}

  ngOnInit(): void {
    // Set initial Spline background visibility based on current route
    const currentUrl = this.router.url;
    const isLandingPage = currentUrl === '/' || currentUrl === '';
    this.showSplineBackground = !isLandingPage;
    
    // Listen to route changes
    this.router.events
      .pipe(filter((event) => isValidEvent(event)))
      .subscribe((event: ValidEvents) => {
        if (event instanceof NavigationStart) {
          if (!this.disabled_index_loader) {
            const element = document.getElementById('first_page_loading');
            element?.classList.add('fade-out');
            this.disabled_index_loader = true;
            this.loading.showLoading(0);
          } else {
            this.loading.showLoading();
          }
        }
        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.loading.hideLoading();
        }
        if (event instanceof NavigationEnd) {
          console.log(event);
          this.showFab = !this.HIDE_FAB_ROUTES.includes(event.url);
          const urlWithoutQueryParams = event.url.split('?')[0].substring(1);
          const firstSubPath = urlWithoutQueryParams.split('/')[0] || 'default';
          this.meta.updateMetaTags(firstSubPath);
          
          // Show/hide Spline background based on route
          const isLandingPage = event.url === '/' || event.url === '';
          this.showSplineBackground = !isLandingPage;
        }
      });

    this.supportsWebP((isSupported) => {
      if (!isSupported) {
        document.body.classList.add('no-webp');
      }
    });
  }

  supportsWebP(callback: (result: boolean) => void) {
    const img = new Image();
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
    img.src = 'images/backgrounds/bg1.webp';
  }
}
