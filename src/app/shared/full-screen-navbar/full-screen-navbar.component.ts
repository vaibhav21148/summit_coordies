import { Component, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ReactorCoreComponent } from '../reactor-core/reactor-core.component';

@Component({
  selector: 'app-full-screen-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactorCoreComponent],
  templateUrl: './full-screen-navbar.component.html',
  styleUrl: './full-screen-navbar.component.scss'
})
export class FullScreenNavbarComponent implements AfterViewInit, OnDestroy {
  menuOpen = false;
  isScrolled = false;
  isHomePage = false;
  isHidden = false;
  logoRotation = 0;
  hoveredItemIndex: number | null = null;

  setHoveredItem(index: number | null) {
    this.hoveredItemIndex = index;
  }

  ngAfterViewInit() {
    // LightTunnel handles its own WebGL rendering now
  }

  ngOnDestroy() {
    // Nothing to clean up manually
  }
  


  waitAlert() {
    Swal.fire({
      title: 'Wait!',
      text: 'Wait for E-Summit 2026',
      icon: 'info',
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }



  constructor(private router: Router, private auth: AuthService) {
    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/';
    });
  }

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
    this.toggleMenu(); // Close menu after logout
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 50;
    this.logoRotation = scrollY * 0.5;
    
    // Hide navbar on scroll until stats section on landing page
    if (this.isHomePage) {
      const statsSection = document.querySelector('app-stats');
      if (statsSection) {
        const statsTop = statsSection.getBoundingClientRect().top + window.scrollY;
        
        // Hide navbar when scrolling down, show when reaching stats section
        this.isHidden = scrollY > 100 && scrollY < statsTop - 100;
      }
    } else {
      this.isHidden = false;
    }
  }
}
