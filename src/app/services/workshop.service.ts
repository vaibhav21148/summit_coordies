import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';
import { getErrorMessage } from '../utils/error';

export interface Workshop {
  id: number;
  workshop_name: string;
  price: number;
  description: string;
  islive: boolean;
  date?: string;
  start_time?: string;
  end_time?: string;
  background?: string;
  rules?: string;
  tag?: string;
  is_online?: boolean;
}

export interface WorkshopRegistrationRequest {
  workshops: string[];
  coupon_code?: string;
  friends?: {
    name: string;
    email: string;
    contact: string;
    workshops: string[];
  }[];
}

export interface WorkshopRegistrationResponse {
  success: string;
  final_price?: number;
  order?: {
    id: number;
    order_id: string;
    amount: number;
    email: string;
    contact: string;
  };
}

export interface WorkshopsResponse {
  workshops: Workshop[];
  user_registrations: { [key: string]: boolean };
  has_registrations: boolean;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private readonly API_URL = environment.API_URL;
  private workshopsCache: WorkshopsResponse | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  async getWorkshops(): Promise<WorkshopsResponse> {
    const now = Date.now();
    
    if (this.workshopsCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.workshopsCache;
    }

    try {
      const response = await lastValueFrom(
        this.http.get<WorkshopsResponse>(`${this.API_URL}/workshops/`, {
          headers: this.authService.headers
        })
      );
      
      this.workshopsCache = response;
      this.cacheTimestamp = now;
      return response;
    } catch (error) {
      throw getErrorMessage(error);
    }
  }

  async registerForWorkshops(data: WorkshopRegistrationRequest): Promise<WorkshopRegistrationResponse> {
    try {
      const response = await lastValueFrom(
        this.http.post<WorkshopRegistrationResponse>(`${this.API_URL}/event_reg/workshops/`, data, {
          headers: this.authService.headers
        })
      );
      return response;
    } catch (error) {
      throw getErrorMessage(error);
    }
  }

  async getRegistrationStatus(): Promise<{ user_registrations: { [key: string]: boolean }, has_registrations: boolean }> {
    try {
      const response = await lastValueFrom(
        this.http.get<{ user_registrations: { [key: string]: boolean }, has_registrations: boolean }>(`${this.API_URL}/event_reg/workshops/`, {
          headers: this.authService.headers
        })
      );
      return response;
    } catch (error) {
      throw getErrorMessage(error);
    }
  }

  getRegisteredWorkshops(): string[] {
    // This method can be used to get a list of registered workshop names
    // Implementation would depend on how you want to store/cache this data
    return [];
  }

  async verifyPayment(data: PaymentVerificationRequest): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.http.post(`${this.API_URL}/payments/workshop/verify/`, data)
      );
      return response;
    } catch (error) {
      throw getErrorMessage(error);
    }
  }
}