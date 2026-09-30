import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { RegisterService } from '@services/register.service';
import { PaymentsService } from '@services/payments.service';
import { Endpoint } from '@constants/enums/endpoints.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-workshop-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workshop-payment.component.html',
  styleUrl: './workshop-payment.component.scss'
})
export class WorkshopPaymentComponent implements OnInit {
  userRegistrations: any[] = [];
  isLoading = true;
  isProcessingPayment = false;

  constructor(
    private authService: AuthService,
    private registerService: RegisterService,
    private paymentsService: PaymentsService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.authService.redirectToLogin({ returnUrl: '/workshops/payment' });
      return;
    }

    await this.checkRegistrationStatus();
  }

  async checkRegistrationStatus() {
    try {
      // Show coming soon popup
      await Swal.fire({
        title: 'Coming Soon!',
        text: 'Workshop payments will be available soon. Stay tuned!',
        icon: 'info',
        timer: 3000
      });
      
      await this.loadUserRegistrations();
    } catch (error) {
      console.error('Error checking registration status:', error);
      this.isLoading = false;
    }
  }

  async loadUserRegistrations() {
    try {
      // Show coming soon message instead of actual registrations
      this.userRegistrations = [];
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading registrations:', error);
      this.isLoading = false;
    }
  }

  async proceedToPayment(workshop: any) {
    if (this.isProcessingPayment) return;
    
    this.isProcessingPayment = true;

    try {
      const paymentData = {
        email: this.authService.getStoredUserInfo('email'),
        workshops: [workshop.workshop]
      };

      const response = await this.registerService.genericRegister(
        paymentData,
        Endpoint.WORKSHOP,
        true
      );

      if (response.order) {
        console.log('Payment order created:', response.order);
      }

    } catch (error) {
      await Swal.fire({
        title: 'Payment Error',
        text: 'Failed to initiate payment. Please try again.',
        icon: 'error'
      });
    } finally {
      this.isProcessingPayment = false;
    }
  }

  goBack() {
    this.router.navigate(['/workshops']);
  }
}