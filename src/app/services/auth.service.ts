import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { getErrorMessage } from '../utils/error';
import { PassType } from '@constants/enums/passtype.enum';

interface LoginResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.API_URL;
  private readonly ACCESS_TOKEN_KEY = 'ES26_ACCESS_TOKEN';
  private readonly USER_CACHE_KEY = 'ES26_USER_CACHE';
  private userInfoCache: any;
  private readonly PASSMAPPING = {
    none: 0,
    lvl1: 1,
    lvl2: 2,
    lvl3: 3,
    lvl4: 4,
  };

  constructor(private http: HttpClient, private router: Router) {}

  get token(): string {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) || '';
  }

  set token(value: string) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, value);
  }

  get headers() {
    if (!this.token) return {} as HttpHeaders;
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }

  getHeadersForInterceptors() {
    return this.headers as { [key: string]: string };
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  async checkValidLogin(): Promise<boolean> {
    if (!this.isLoggedIn()) return false;

    try {
      await lastValueFrom(
        this.http.get(`${this.API_URL}/${Endpoint.USER_INFO}`, {
          headers: this.headers,
        })
      );
      return true;
    } catch (err) {
      if (
        err instanceof HttpErrorResponse &&
        err.status == 403 &&
        err.error.detail == 'Authentication credentials were not provided.'
      ) {
        this.logout();
        return false;
      }
      throw err;
    }
  }

  async login(
    email: string,
    password: string,
    skip_reg_check: boolean = false
  ): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.http.post<LoginResponse>(`${this.API_URL}/${Endpoint.LOGIN}`, {
          email,
          password,
          skip_reg_check,
        })
      );
      this.token = res.access;
    } catch (e: any) {
      throw getErrorMessage(e);
    }
  }

  async loginGoogle(token: string): Promise<void> {
    try {
      const res = await lastValueFrom(
        this.http.post<LoginResponse>(
          `${this.API_URL}/${Endpoint.LOGIN_GOOGLE}`,
          {
            token,
          }
        )
      );

      this.token = res.access;
    } catch (e: any) {
      throw getErrorMessage(e);
    }
  }

  redirectToLogin(
    options: {
      returnUrl?: string;
      skipModal?: boolean;
      showButtons?: boolean;
    } = {}
  ) {
    const { returnUrl, skipModal = false, showButtons = false } = options;
    // TODO: Replace with RxJS
    if (!skipModal) {
      this.promptLogin(showButtons).then((swalResult) => {
        if (showButtons && !swalResult.isConfirmed) return;
        this.router.navigate(['/login'], {
          queryParams: { returnUrl },
        });
      });
    } else {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl },
      });
    }
  }

  promptLogin(showButtons: boolean = true) {
    return Swal.fire({
      title: 'Authentication Required',
      text: 'You need to be logged in to continue.',
      icon: 'info',
      showCancelButton: showButtons,
      showConfirmButton: showButtons,
      confirmButtonText: 'Login',
      timer: showButtons ? undefined : 2000,
    });
  }

  async getUserInfo(key: string, force_fetch: boolean = false) {
    if (!this.isLoggedIn()) return;
    // if we arent doin force fetcha and the data in cache is also not present then we check local storage for this
    if (!force_fetch && !this.userInfoCache?.[key]) {
      // Extract stringified JSON from localStorage
      const storedInfo = localStorage.getItem(this.USER_CACHE_KEY);
      if (storedInfo) this.userInfoCache = JSON.parse(storedInfo);
    }
    // if we are doin force fetch or the data in cache is not present  then we fetch from api url
    if (force_fetch || !this.userInfoCache?.[key]) {
      const res = await lastValueFrom(
        this.http.get(`${this.API_URL}/${Endpoint.USER_INFO}`, {
          headers: this.headers,
        })
      ).catch((e: HttpErrorResponse) => {
        console.error(e);
      });

      if (res) {
        this.userInfoCache = res;
        localStorage.setItem(this.USER_CACHE_KEY, JSON.stringify(res));
      }
    }

    const val = this.userInfoCache?.[key];
    if (
      val == 'null' ||
      val == '' ||
      val == null ||
      val == undefined ||
      val == 'undefined'
    )
      return '';

    return val;
  }

  getStoredUserInfo(key: string) {
    if (!this.isLoggedIn()) return;
    // if we arent doin force fetcha and the data in cache is also not present then we check local storage for this
    if (!this.userInfoCache?.[key]) {
      // Extract stringified JSON from localStorage
      const storedInfo = localStorage.getItem(this.USER_CACHE_KEY);
      if (storedInfo) this.userInfoCache = JSON.parse(storedInfo);
    }

    const val = this.userInfoCache?.[key];
    if (
      val == 'null' ||
      val == '' ||
      val == null ||
      val == undefined ||
      val == 'undefined'
    )
      return '';

    return val;
  }

  getPassLabel(summitPass: string): string {
    switch (summitPass) {
      case 'lvl1':
        return 'Silver';
      case 'lvl2':
        return 'Gold';
      case 'lvl3':
        return 'Platinum';
      case 'lvl4':
        return 'Signature';
      case 'none':
        return 'None';
      default:
        return 'Unknown';
    }
  }

  checkCurrentPass(condition: 'eq' | 'lt' | 'gt', pass_type: PassType) {
    const currentPass = this.getStoredUserInfo('summit_pass') as PassType;
    if (currentPass == null || currentPass == undefined) return false;
    if (condition == 'eq') return pass_type == currentPass;
    else if (condition == 'lt')
      return this.PASSMAPPING[pass_type] > this.PASSMAPPING[currentPass];
    else if (condition == 'gt')
      return this.PASSMAPPING[pass_type] < this.PASSMAPPING[currentPass];
    return false;
  }

  clearUserInfo() {
    this.userInfoCache = undefined;
    localStorage.removeItem(this.USER_CACHE_KEY);
  }

  logout() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.clearUserInfo();
  }
}
