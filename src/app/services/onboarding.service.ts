import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import { getErrorMessage } from '../utils/error';
import { interval, Subscription } from 'rxjs';

interface LoginResponse {
  access: string;
  refresh: string;
}

type UserProfileInfo = any;

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private readonly API_URL = environment.API_URL;

  otpResendTimer: number = 0;
  private otpResendSubscription?: Subscription;

  constructor(private http: HttpClient, private authService: AuthService) {}

  async findEmail(email: string): Promise<'regdone' | 'found' | 'notfound'> {
    let res: any;
    try {
      res = await lastValueFrom(
        this.http.get<{ found: boolean }>(
          `${this.API_URL}/${Endpoint.FIND_USER}`,
          {
            params: { email },
          }
        )
      );
    } catch (e) {
      const error = e as HttpErrorResponse;
      throw error.error.message || error.error.error;
    }

    return res['registered'] ? 'regdone' : res['found'] ? 'found' : 'notfound';
  }

  async login(email: string, password: string): Promise<void> {
    return this.authService.login(email, password, true);
  }

  async sendOTP(email: string): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.http.post<{ found: boolean }>(
          `${this.API_URL}/${Endpoint.SEND_OTP}`,
          { email }
        )
      );
    } catch (e: any) {
      throw getErrorMessage(e);
    }
  }

  async getData(): Promise<UserProfileInfo> {
    try {
      const res = await lastValueFrom(
        this.http.get<any>(`${this.API_URL}/${Endpoint.VERIFY_OTP}`, {
          headers: {
            Authorization: `Bearer ${this.authService.token}`,
          },
        })
      );

      return res;
    } catch (e: any) {
      throw getErrorMessage(e);
    }
  }

  async verifyOTP(email: string, otp: string): Promise<UserProfileInfo> {
    try {
      const res = await lastValueFrom(
        this.http.post<any>(`${this.API_URL}/${Endpoint.VERIFY_OTP}`, {
          email,
          otp,
        })
      );

      return res;
    } catch (e: any) {
      throw getErrorMessage(e);
    }
  }

  async register(details: any): Promise<void> {
    const options = this.authService.isLoggedIn()
      ? { headers: this.authService.headers }
      : undefined;
    try {
      const res = await lastValueFrom(
        this.http.post<LoginResponse>(
          `${this.API_URL}/${Endpoint.REGISTER}`,
          {
            ...details,
          },
          options
        )
      );

      this.authService.token = res['access'];
    } catch (e: any) {
      throw getErrorMessage(e);
    }
  }

  async resetPassword(
    email: string,
    password: string,
    otp: string
  ): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.http.post<LoginResponse>(
          `${this.API_URL}/${Endpoint.RESET_PASSWORD}`,
          {
            email,
            otp,
            password,
          }
        )
      );

      this.authService.token = res['access'];
    } catch (e: any) {
      throw getErrorMessage(e);
    }
  }

  isOTPTimerOver() {
    return this.otpResendTimer === 0;
  }

  startOTPTimer() {
    this.otpResendSubscription?.unsubscribe();
    this.otpResendTimer = 30;
    this.otpResendSubscription = interval(1000).subscribe(() => {
      if (this.otpResendTimer > 0) {
        this.otpResendTimer--;
      } else {
        this.otpResendSubscription?.unsubscribe();
      }
    });
  }

  resetOTPTimer() {
    this.otpResendSubscription?.unsubscribe();
    this.otpResendTimer = 0;
  }
}
