import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { PaymentsService } from './payments.service';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { handleAPIException, getErrorMessage } from 'src/app/utils/error';

export interface MUNGroupPaymentOrder {
  success: string;
  final_price: number;
  order: {
    id: number;
    order_id: string;
    amount: number;
    is_paid: boolean;
    date_created: string;
    email: string;
    contact: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MunGroupPaymentsService {
  constructor(
    private http: HttpClient,
    private paymentsService: PaymentsService,
    private auth: AuthService
  ) {}

  async createMUNGroupPayment(couponCode?: string): Promise<MUNGroupPaymentOrder> {
    try {
      const response: any = await lastValueFrom(
        this.http.post(
          environment.API_URL + '/mun/group/payment/',
          { coupon_code: couponCode },
          { headers: this.auth.headers }
        )
      );
      return response;
    } catch (error) {
      handleAPIException(getErrorMessage(error));
      throw error;
    }
  }

  async processMUNGroupPayment(
    couponCode?: string,
    paymentType: 'modal' | 'hosted' = 'hosted'
  ): Promise<boolean> {
    if (!this.auth.isLoggedIn()) {
      this.auth.redirectToLogin({ returnUrl: '/entremun/dash' });
      return false;
    }

    const confirmation = await this.paymentsService.warnForPayment(paymentType);
    if (!confirmation.isConfirmed) {
      return false;
    }

    try {
      const orderData = await this.createMUNGroupPayment(couponCode);

      // If no order is returned, it means payment was free/completed
      if (!orderData.order) {
        await Swal.fire({
          title: 'Payment Successful',
          text: orderData.success || 'MUN group payment completed successfully!',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
        });
        return true;
      }

      if (paymentType === 'modal') {
        const result = this.paymentsService.attemptPayment(
          {
            order_id: orderData.order.order_id,
            email: orderData.order.email,
            contact: orderData.order.contact
          },
          Endpoint.VERIFY_MUN_GROUP_PAYMENT,
          'MUN Group Registration Payment',
          'modal'
        ) as Promise<boolean>;
        return await result;
      } else {
        this.paymentsService.attemptPayment(
          {
            order_id: orderData.order.order_id,
            email: orderData.order.email,
            contact: orderData.order.contact
          },
          Endpoint.VERIFY_MUN_GROUP_PAYMENT,
          'MUN Group Registration Payment',
          'hosted'
        );
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}