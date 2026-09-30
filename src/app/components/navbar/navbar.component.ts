import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services/auth.service';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swal from 'sweetalert2';

enum ScrollStates {
  IN,
  OUT,
  LOCKED_IN,
  LOCKED_OUT,
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  profile: any;
  firstName: any;
  lastName: any;
  email: any;
  summit_pass: any;
  summit_id: any;
  lastScrollTop = 0;
  logoRotation = 0;
  @Input() isLocked = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    if (this.isLocked) return;

    const st = window.pageYOffset || document.documentElement.scrollTop;
    this.logoRotation = st * 0.5;
    
    if (st - this.lastScrollTop > 30) {
      // downscroll code
      this.element?.nativeElement?.classList.add('scrolled-nav');
      this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    } else if (this.lastScrollTop - st > 30) {
      // upscroll code
      this.element?.nativeElement?.classList.remove('scrolled-nav');
      this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }
  }

  constructor(
    private router: Router,
    private auth: AuthService,
    private element: ElementRef
  ) {}

  ngOnInit(): void {
    this.getDetails();
  }

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  ngAfterViewInit() {
    this.startLogoAnimation();
  }

  comingSoon() {
    Swal.fire({
      title: 'Coming Soon!',
      text: 'This page has not been released yet. Please check back later.',
      icon: 'info',
    });
  }

  waitAlert() {
    Swal.fire({
      title: 'Wait!',
      text: 'Wait for E-Summit 2026',
      icon: 'info',
    });
  }

  startLogoAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    });

    tl.to('.summit-logo', {
      rotation: 900, // 360 degrees * 10 (10% intervals)
      ease: 'none', // Linear progression for constant rotation speed
    });
  }

  get mobile() {
    return window.innerWidth <= 768;
  }

  async getDetails() {
    this.profile =
      (await this.auth.getUserInfo('profile')) ||
      'images/logos/nav-profile.png';
    this.firstName = this.auth.getStoredUserInfo('firstName');
    this.lastName = this.auth.getStoredUserInfo('lastName');
    this.email = this.auth.getStoredUserInfo('email');
    this.summit_pass = this.auth.getStoredUserInfo('summit_pass');
    this.summit_id = this.auth.getStoredUserInfo('summit_id');
  }

  Logout() {
    this.auth.logout();
    this.router.navigate(['/']);
    return;
  }
}
