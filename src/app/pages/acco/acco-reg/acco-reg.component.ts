import { Component, OnInit } from '@angular/core';
import { Endpoint } from '@constants/enums/endpoints.enum';
import {
  AutoFormComponent,
  AutoFormOptions,
} from '@shared/form/auto-form/auto-form.component';
import { ACCO_REG_QUESTIONS } from './acco-reg.questions';
import { RegisterService } from '@services/register.service';
import { UserDataService } from '@services/user-data.service';
import { GeneralDataService } from '@services/general-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { KonfhubWidgetComponent } from '../../../components/konfhub-widget/konfhub-widget.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acco-reg',
  standalone: true,
  imports: [AutoFormComponent, KonfhubWidgetComponent],
  templateUrl: './acco-reg.component.html',
  styleUrl: './acco-reg.component.scss'
})
export class AccoRegComponent implements OnInit {
  questions = ACCO_REG_QUESTIONS;
  stepNames: string[] = ['Details'];
  stepQuestions: string[][] = [['members']];
  userPrefillData: any;
  heading = 'Accommodation Registration';
  description = 'Complete your registration for student accommodation';
  showWidget = false;
  userEmail?: string;
  userName?: string;
  accommodationId?: string;
  numberOfMales?: number;
  numberOfFemales?: number;
  groupCode?: string;
  isAccoRegistrationClosed = false;

  
  options: AutoFormOptions = {
    loginRequired: true,
    regEndpoint: Endpoint.ACCO,
    logo: 'images/logos/acco.png',
    returnLink: '/dashboard/accommodation',
    paymentEndpoint: Endpoint.ACCO_VERIFY_PAYMENT,
    paymentDescription: 'Student Accommodation',
    submitText: 'Register',
    customHandle: true,
    successSwalOptions: { 
      title: '',
      text: '',
      showConfirmButton: false, 
      timer: 1,
      icon: undefined
    }
  };

  constructor(
    private registerService: RegisterService,
    private userDataService: UserDataService,
    private generalDataService: GeneralDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.isAccoRegistrationClosed) {
      Swal.fire({
        title: 'Accommodation Registration Ends',
        text: 'Accommodation registration has been closed. Please proceed to payment.',
        icon: 'info',
        confirmButtonText: 'Go to Payment',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        this.router.navigate(['/dashboard/accommodation']);
      });
      return;
    }
    
    this.userPrefillData = this.userDataService.getUserPrefillData();
    console.log('userPrefillData:', this.userPrefillData);
    
    // Handle group code from query parameters
    this.route.queryParams.subscribe(params => {
      this.groupCode = params['groupCode'];
      if (this.groupCode) {
        console.log('Group code provided:', this.groupCode);
      }
    });
  }

  async onRegistrationComplete(data: any) {
    console.log('🔥 CUSTOM HANDLER CALLED - Accommodation registration completed with data:', data);
    
    try {
      // Add group code to data if provided
      if (this.groupCode) {
        data.group_code = this.groupCode;
      }
      
      // First complete the registration
      const hasFile = this.registerService.hasFile(this.questions);
      const response = await this.registerService.genericRegister(
        data,
        this.options.regEndpoint,
        hasFile
      );
      
      console.log('Registration successful:', response);
      
      // Show payment options swal
      const result = await Swal.fire({
        title: 'Registration Successful!',
        text: 'Would you like to complete your payment now or do it later?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Make Payment Now',
        cancelButtonText: 'Pay Later',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#6c757d'
      });
      
      if (result.isConfirmed) {
        // Show detailed payment confirmation swal like in dashboard
        this.accommodationId = response.accommodation_id;
        
        const accommodationIdHtml = this.accommodationId ? 
          `<div style="margin: 15px 0; padding: 10px; background: rgba(255, 225, 0, 0.1); border: 1px solid rgba(255, 225, 0, 0.3); border-radius: 8px;">
            <strong style="color: #FFE100;">Fill this in your Accommodation ID field:</strong><br>
            <span style="font-family: monospace; font-size: 16px; color: #F9F9F4; background: rgba(255, 225, 0, 0.1); padding: 4px 8px; border-radius: 4px; margin-top: 8px; display: inline-block;">${this.accommodationId}</span>
            <button onclick="navigator.clipboard.writeText('${this.accommodationId}'); this.innerText='Copied!'; setTimeout(() => this.innerText='Copy', 2000)" 
                    style="margin-left: 10px; padding: 5px 10px; background: #FFE100; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Copy</button>
          </div>` : '';

        const warningMessage = `<div style="margin: 15px 0; padding: 15px; background: rgba(255, 193, 7, 0.1); border: 2px solid #ffc107; border-radius: 8px; text-align: center;">
          <strong style="color: #856404; font-size: 16px;">⚠️ IMPORTANT WARNING ⚠️</strong><br>
          <span style="color: #856404; font-weight: 600; font-size: 14px;">Do not change the quantity of tickets from the number mentioned here. If changed, your accommodation will not be counted.</span>
        </div>`;
        
        const paymentResult = await Swal.fire({
          title: 'Payment Confirmation',
          html: `${warningMessage}${accommodationIdHtml}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Proceed to Payment',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#6c757d'
        });
        
        if (paymentResult.isConfirmed) {
          // Fetch profile data for correct user info like dashboard does
          try {
            const profileData: any = await this.generalDataService.getEndpointData(Endpoint.PROFILE).toPromise();
            
            this.userEmail = profileData?.email || this.userPrefillData?.email;
            this.userName = `${profileData?.firstName || ''} ${profileData?.lastName || ''}`.trim() || profileData?.name || profileData?.first_name || 'User';
            
            // Use response data for participant counts
            this.numberOfMales = response.number_of_males || response.total_members || data.members?.length || 1;
            this.numberOfFemales = response.number_of_females || 0;
            
            console.log('Registration setting user data from profile:', {
              email: this.userEmail,
              name: this.userName,
              accommodationId: this.accommodationId,
              numberOfMales: this.numberOfMales,
              numberOfFemales: this.numberOfFemales,
              profileData: profileData,
              responseData: response
            });
          } catch (error) {
            console.error('Failed to fetch profile data:', error);
            // Fallback to prefill data
            this.userEmail = this.userPrefillData?.email || 'user@example.com';
            this.userName = this.userPrefillData?.firstName || 'User';
            this.numberOfMales = data.members?.length || 1;
            this.numberOfFemales = 0;
          }
          
          this.showWidget = true;
        } else {
          // If cancelled, redirect to dashboard
          this.router.navigate(['/dashboard/accommodation']);
        }
      } else {
        // Show info and redirect to dashboard
        await Swal.fire({
          title: 'Registration Complete',
          text: 'You can make payment later from your dashboard.',
          icon: 'info',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigate(['/dashboard/accommodation']);
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      console.error('Error structure:', JSON.stringify(error, null, 2));
      
      // Handle specific error for already in group
      let errorMessage = 'Registration failed. Please try again.';
      
      // Try different paths to extract the error message
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (typeof error?.error === 'string') {
        errorMessage = error.error;
      } else if (error?.error?.error) {
        errorMessage = error.error.error;
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      if (errorMessage.includes('already part of a group') || errorMessage.includes('already registered for accommodation')) {
        await Swal.fire({
          title: 'Already Registered',
          text: errorMessage,
          icon: 'info',
          confirmButtonText: 'Go to Dashboard'
        });
        this.router.navigate(['/dashboard/accommodation']);
      } else {
        await Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error'
        });
      }
    }
  }

  async onPaymentCompleted() {
    this.showWidget = false;
    this.router.navigate([this.options.returnLink]);
  }


}
