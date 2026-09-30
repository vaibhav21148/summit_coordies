import { Component, ViewEncapsulation } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-fab',
  standalone: true,
  imports: [DialogModule, CommonModule, RouterModule],
  templateUrl: './fab.component.html',
  styleUrl: './fab.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FabComponent {
  constructor(private authService: AuthService, private router: Router) {}

  openNav(): void {
    const sidepanel = document.getElementById("mySidepanel");
    if (sidepanel) {
      sidepanel.style.width = "250px"; // Show the sidepanel
    }
  }

  closeNav(): void {
    const sidepanel = document.getElementById("mySidepanel");
    if (sidepanel) {
      sidepanel.style.width = "0"; // Hide the sidepanel
    }
  }

  visible = false;

  ShowDetails() {
    this.visible = true;
  }

  closePopup() {
    this.visible = false; // Close popup
  }

  checkLoginAndNavigate() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/pass']);
    } else {
      this.authService.redirectToLogin({ returnUrl: '/pass' });
    }
  }
}
