import { Injectable } from '@angular/core';
import { PaymentsService } from './payments.service';
import { Endpoint } from '@constants/enums/endpoints.enum';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WorkshopPaymentService {
  constructor(
    private paymentsService: PaymentsService,
    private router: Router
  ) {}

  async processPayment(orderData: any, userEmail: string, userContact: string): Promise<boolean> {
    try {
      const warningResult = await this.paymentsService.warnForPayment('hosted');
      if (!warningResult.isConfirmed) {
        return false;
      }

      const paymentData = {
        order_id: orderData.order_id,
        email: userEmail,
        contact: userContact
      };

      this.paymentsService.attemptPayment(
        paymentData,
        Endpoint.VERIFY_WORKSHOP_PAYMENT,
        'Workshop Registration Payment',
        'hosted'
      );

      // Hosted payment will redirect, so we return true
      return true;
    } catch (error) {
      console.error('Payment processing failed:', error);
      return false;
    }
  }
}