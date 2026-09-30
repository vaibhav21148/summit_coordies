import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  
  constructor(private authService: AuthService) {}

  async getUserPrefillData(): Promise<any> {
    if (!this.authService.isLoggedIn()) return null;
    
    const firstName = await this.authService.getUserInfo('firstName');
    const lastName = await this.authService.getUserInfo('lastName');
    
    let userName = '';
    if (firstName && lastName) {
      userName = `${firstName} ${lastName}`;
    }
    
    return {
      name: userName,
      email: await this.authService.getUserInfo('email'),
      contact: await this.authService.getUserInfo('phone') || await this.authService.getUserInfo('mobile') || await this.authService.getUserInfo('contact')
    };
  }
}