import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { PaymentsService } from './payments.service';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { handleAPIException, getErrorMessage } from 'src/app/utils/error';

export interface ContingentMember {
  member_id: number;
  member_email: string;
  member_name?: string;
  member_phone?: string;
  current_pass: string;
  default_upgrade: string;
  entered_contingent: boolean;
  bought_by_contingent: boolean;
  is_leader: boolean;
  pending_upgrade?: string;
}

export interface ContingentMembersResponse {
  members: ContingentMember[];
  member_count: number;
  auto_discount_percent: number;
  available_passes: { value: string; label: string }[];
}

export interface ContingentPricingRequest {
  member_upgrades: { [key: string]: string };
  coupon_code?: string;
}

export interface ContingentPricingResponse {
  discount_percent: number;
  flat_discount: number | null;
  pre_amount: number;
  code: string;
  final_amount: number;
  breakdown: any[];
  member_count: number;
  auto_discount_percent: number;
  amount_before_auto_discount: number;
  amount_after_auto_discount: number;
}

export interface ContingentPaymentOrder {
  success: string;
  order: {
    id: number;
    order_id: string;
    amount: number;
    is_paid: boolean;
    date_created: string;
  };
  breakdown: any[];
  member_count: number;
  auto_discount_percent: number;
  amount_before_auto_discount: number;
  amount_after_auto_discount: number;
}

@Injectable({
  providedIn: 'root',
})
export class ContingentPaymentsService {
  constructor(
    private http: HttpClient,
    private paymentsService: PaymentsService,
    private auth: AuthService
  ) {}

  async getContingentInfo(): Promise<any> {
    try {
      const response: any = await lastValueFrom(
        this.http.get(
          environment.API_URL + '/' + Endpoint.CONTINGENT_INFO,
          { headers: this.auth.headers }
        )
      );
      return response;
    } catch (error) {
      handleAPIException(getErrorMessage(error));
      throw error;
    }
  }

  async getContingentStatus(): Promise<any> {
    try {
      const response: any = await lastValueFrom(
        this.http.get(
          environment.API_URL + '/' + Endpoint.CONTINGENT,
          { headers: this.auth.headers }
        )
      );
      return response;
    } catch (error) {
      handleAPIException(getErrorMessage(error));
      throw error;
    }
  }

  async getContingentMembers(): Promise<ContingentMembersResponse> {
    try {
      const response: any = await lastValueFrom(
        this.http.get(
          environment.API_URL + '/' + Endpoint.CONTINGENT_PRICE_INFO,
          { headers: this.auth.headers }
        )
      );
      return response;
    } catch (error) {
      handleAPIException(getErrorMessage(error));
      throw error;
    }
  }

  async getContingentPricing(data: ContingentPricingRequest): Promise<any> {
    try {
      const response: any = await lastValueFrom(
        this.http.post(
          environment.API_URL + '/' + Endpoint.CONTINGENT_PRICE_INFO,
          data,
          { headers: this.auth.headers }
        )
      );
      return { success: true, data: response };
    } catch (error: any) {
      const errorMsg = getErrorMessage(error);
      
      // Handle coupon code errors specifically
      if (error.status === 400) {
        // Get fallback pricing without coupon
        try {
          const fallbackResponse: any = await lastValueFrom(
            this.http.post(
              environment.API_URL + '/' + Endpoint.CONTINGENT_PRICE_INFO,
              { member_upgrades: data.member_upgrades },
              { headers: this.auth.headers }
            )
          );
          
          return {
            success: false,
            error: errorMsg,
            coupon_valid: false,
            fallback_pricing: { data: fallbackResponse }
          };
        } catch (fallbackError) {
          return {
            success: false,
            error: errorMsg,
            coupon_valid: false
          };
        }
      }
      
      handleAPIException(errorMsg);
      throw error;
    }
  }

  async createContingentPayment(data: ContingentPricingRequest): Promise<ContingentPaymentOrder> {
    try {
      const response: any = await lastValueFrom(
        this.http.post(
          environment.API_URL + '/' + Endpoint.CREATE_CONTINGENT_PAYMENT,
          data,
          { headers: this.auth.headers }
        )
      );
      return response;
    } catch (error) {
      handleAPIException(getErrorMessage(error));
      throw error;
    }
  }

  async addContingentMember(email: string): Promise<any> {
    try {
      const response: any = await lastValueFrom(
        this.http.post(
          environment.API_URL + '/' + Endpoint.CL_MEMBERS,
          { email },
          { headers: this.auth.headers }
        )
      );
      return response;
    } catch (error) {
      handleAPIException(getErrorMessage(error));
      throw error;
    }
  }

  async removeContingentMember(memberId: number): Promise<any> {
    try {
      const response: any = await lastValueFrom(
        this.http.delete(
          environment.API_URL + '/' + Endpoint.CL_MEMBERS,
          { 
            headers: this.auth.headers,
            body: { member_id: memberId }
          }
        )
      );
      return response;
    } catch (error) {
      handleAPIException(getErrorMessage(error));
      throw error;
    }
  }

  async createContingent(): Promise<any> {
    try {
      const response: any = await lastValueFrom(
        this.http.post(
          environment.API_URL + '/' + Endpoint.CONTINGENT,
          {},
          { headers: this.auth.headers }
        )
      );
      return response;
    } catch (error) {
      handleAPIException(getErrorMessage(error));
      throw error;
    }
  }

  async leaveContingent(): Promise<any> {
    try {
      const response: any = await lastValueFrom(
        this.http.delete(
          environment.API_URL + '/' + Endpoint.CL_MEMBERS,
          { headers: this.auth.headers }
        )
      );
      return response;
    } catch (error) {
      handleAPIException(getErrorMessage(error));
      throw error;
    }
  }

  async processContingentPayment(
    memberUpgrades: { [key: string]: string },
    couponCode?: string,
    paymentType: 'modal' | 'hosted' = 'hosted'
  ): Promise<boolean> {
    if (!this.auth.isLoggedIn()) {
      this.auth.redirectToLogin({ returnUrl: '/cl/dash' });
      return false;
    }

    const confirmation = await this.paymentsService.warnForPayment(paymentType);
    if (!confirmation.isConfirmed) {
      return false;
    }

    try {
      const orderData = await this.createContingentPayment({
        member_upgrades: memberUpgrades,
        coupon_code: couponCode
      });

      if (paymentType === 'modal') {
        const result = this.paymentsService.attemptPayment(
          {
            order_id: orderData.order.order_id,
            email: this.auth.getStoredUserInfo('email'),
            contact: this.auth.getStoredUserInfo('contact')
          },
          Endpoint.VERIFY_CONTINGENT_PAYMENT,
          'Payment for Contingent Pass Upgrade',
          'modal'
        ) as Promise<boolean>;
        return await result;
      } else {
        this.paymentsService.attemptPayment(
          {
            order_id: orderData.order.order_id,
            email: this.auth.getStoredUserInfo('email'),
            contact: this.auth.getStoredUserInfo('contact')
          },
          Endpoint.VERIFY_CONTINGENT_PAYMENT,
          'Payment for Contingent Pass Upgrade',
          'hosted'
        );
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}