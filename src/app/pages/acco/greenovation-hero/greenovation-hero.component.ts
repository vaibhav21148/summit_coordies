import { Component, inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { CommonModule } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as AOS from 'aos';
import Swal from 'sweetalert2';
import { AuthService } from '@services/auth.service';

declare var gsap: any;
declare var ScrollTrigger: any;

@Component({
  selector: 'app-greenovation-hero',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './greenovation-hero.component.html',
  styleUrls: ['./greenovation-hero.component.css']
})
export class GreenovationHeroComponent implements OnInit, OnDestroy, AfterViewInit {
  private viewportScroller = inject(ViewportScroller);
  private scrollTriggerInstance: any;
  private animationInitialized = false;
  private destroy$ = new Subject<void>();
  private totalFrames = 61;

  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit() {
    // Initialize AOS
    AOS.init({
      duration: 1500,
      easing: 'ease-out-back',
      once: false,
      mirror: true,
      offset: 100
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.animationInitialized) {
        setTimeout(() => {
          this.cleanupAnimation();
          this.loadGSAP();
        }, 100);
      }
    });
  }

  ngAfterViewInit() {
    this.loadGSAP();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupAnimation();
  }

  private cleanupAnimation() {
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
      this.scrollTriggerInstance = null;
    }
    this.animationInitialized = false;
  }

  private async loadGSAP() {
    if (typeof gsap === 'undefined') {
      try {
        const gsapModule = await import('gsap');
        const scrollTriggerModule = await import('gsap/ScrollTrigger');
        (window as any).gsap = (gsapModule as any).gsap;
        (window as any).ScrollTrigger = (scrollTriggerModule as any).ScrollTrigger;
        (gsapModule as any).gsap.registerPlugin((scrollTriggerModule as any).ScrollTrigger);
      } catch (error) {
        console.warn('GSAP not available, using fallback animation');
        this.initFallbackAnimation();
        return;
      }
    }
    this.initAnimation();
  }

  private initAnimation() {
    if (this.animationInitialized) {
      return;
    }

    const gsapInstance = (window as any).gsap || gsap;
    const ScrollTriggerInstance = (window as any).ScrollTrigger || ScrollTrigger;

    if (typeof gsapInstance === 'undefined' || typeof ScrollTriggerInstance === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded, using fallback');
      this.initFallbackAnimation();
      return;
    }

    this.cleanupAnimation();

    gsapInstance.fromTo('.orange-glow-bg',
      { y: '100%' },
      { y: '10%', duration: 2, ease: 'power2.out', delay: 0.1 }
    );

    gsapInstance.fromTo('.circle-img',
      { y: -800, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'back.out(1.5)', delay: 0.1 }
    );

    this.animationInitialized = true;
  }

  private initFallbackAnimation() {
    const glowBg = document.querySelector('.orange-glow-bg') as HTMLElement;
    if (glowBg) {
      glowBg.style.transform = 'translateX(-50%) translateY(0%)';
    }
    this.animationInitialized = true;
  }

  scrollToSection(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      const navbarHeight = 60;
      const elementPosition = element.offsetTop - navbarHeight;
      this.viewportScroller.scrollToPosition([0, elementPosition]);
    }
  }

  bookAccommodation() {
    if (!this.auth.isLoggedIn()) {
      this.auth.redirectToLogin({ returnUrl: '/acco' });
      return;
    }

    Swal.fire({
      title: 'How do you want to register?',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Individual Registration',
      denyButtonText: 'Team Registration',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#FF7A1A',
      denyButtonColor: '#FF7A1A',
      background: '#1a1a2e',
      color: '#fff',
    }).then((result) => {
      if (result.isConfirmed) {
        // Individual Registration
        this.openKonfhubWidget('33cfcf35-41a7-4cd3-9ed4-4edd70bcb0ae');
      } else if (result.isDenied) {
        // Team Registration
        this.openKonfhubWidget('ed4acd7f-b9e1-4697-b644-391b20d9f29f');
      }
    });
  }

  private openKonfhubWidget(widgetId: string) {
    Swal.fire({
      html: `<div style="width: 100%; height: 100%; overflow: hidden; border-radius: 8px;"><iframe src="https://konfhub.com/widget/id/${widgetId}" id="konfhub-widget" title="Register for E-Summit 2026 Accommodation" style="width: 100%; height: 75vh; min-height: 600px; border: none;"></iframe></div>`,
      showConfirmButton: false,
      showCloseButton: true,
      width: window.innerWidth > 768 ? '800px' : '95%',
      padding: '0',
      background: '#fff',
      customClass: {
        popup: 'konfhub-swal-popup'
      }
    });
  }
}