import { Injectable } from '@angular/core';
import { PaymentsService } from './payments.service';
import { Endpoint } from '@constants/enums/endpoints.enum';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MunPaymentService {
  constructor(
    private paymentsService: PaymentsService,
    private router: Router
  ) {}

  async processPayment(orderData: any, userEmail: string, userContact: string): Promise<boolean> {
    try {
      // Show payment warning first
      const warningResult = await this.paymentsService.warnForPayment('hosted');
      if (!warningResult.isConfirmed) {
        return false;
      }

      // Prepare payment data with correct structure
      const paymentData = {
        order_id: orderData.order_id,
        email: userEmail,
        contact: userContact
      };

      console.log('MUN Payment Data:', paymentData);
      console.log('Original Order Data:', orderData);

      // Attempt payment
      this.paymentsService.attemptPayment(
        paymentData,
        Endpoint.VERIFY_MUN_PAYMENT,
        'MUN Registration Payment',
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