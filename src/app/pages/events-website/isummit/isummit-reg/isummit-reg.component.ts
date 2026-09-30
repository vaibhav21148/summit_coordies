import { Component, OnInit } from '@angular/core';
import { I_SUMMIT_QUESTIONS } from './isummit.questions';
import { Endpoint } from '@constants/enums/endpoints.enum';
import {
  AutoFormComponent,
  AutoFormOptions,
} from '@shared/form/auto-form/auto-form.component';
import { AuthService } from '@services/auth.service';
import { PassType } from '@constants/enums/passtype.enum';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from '@services/register.service';
import { UserDataService } from '@services/user-data.service';

@Component({
  selector: 'app-isummit-reg',
  standalone: true,
  imports: [AutoFormComponent, CommonModule],
  templateUrl: './isummit-reg.component.html',
})

export class IsummitRegComponent implements OnInit {
  questions = I_SUMMIT_QUESTIONS;
  stepNames = ['Personal Details', 'Startup Details', 'Funding Details'];
  stepQuestions = [
    ['cofounders', 'email', 'contact', 'previously_registered', 'target_incubator'],
    ['startup_name', 'dpiit_reg', 'dpiit_id', 'sector1', 'sector2', 'reg_status', 'website'],
    ['stage_of_startup', 'revenue', 'is_startup_funded', 'pitch_deck']
  ];
  heading = 'I-Summit Registration';
  description = 'Complete your registration for the Incubator Summit';
  userPrefillData: any;
  isSubmitting = false;
  
  options: AutoFormOptions = {
    logo: 'images/logos/I-Summit.png',
    returnLink: '/isummit',
    regEndpoint: Endpoint.I_SUMMIT,
    submitText: 'Register',
    customHandle: true
  };
  
  showForm = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private registerService: RegisterService,
    private userDataService: UserDataService
  ) {}

  async ngOnInit() {
    console.log('I-Summit ngOnInit started');
    console.log('UserDataService:', this.userDataService);
    this.userPrefillData = await this.userDataService.getUserPrefillData();
    console.log('I-Summit prefill data:', this.userPrefillData);
    console.log('Prefill data type:', typeof this.userPrefillData);
    console.log('Prefill data keys:', this.userPrefillData ? Object.keys(this.userPrefillData) : 'null/undefined');
    await this.checkPassRequirement();
    console.log('I-Summit ngOnInit completed');
  }

  async checkPassRequirement() {
    console.log('Checking pass requirement');
    console.log('Is logged in:', this.authService.isLoggedIn());
    if (!this.authService.isLoggedIn()) {
      console.log('User not logged in, redirecting to login');
      this.authService.redirectToLogin({
        returnUrl: this.router.url,
      });
      return;
    }

    const hasRegistered = await this.registerService.hasRegistered(
      this.options.regEndpoint
    );
    if (hasRegistered) {
      await Swal.fire({
        title: 'Already Registered',
        text: 'You have already registered for Incubator Summit.',
        icon: 'info',
        confirmButtonText: 'Ok',
      });
      this.router.navigate([this.options.returnLink]);
      return;
    }
    
    console.log('Setting showForm to true');
    this.showForm = true;
    console.log('showForm is now:', this.showForm);
  }

  async onRegistrationComplete(data: any) {
    console.log('Registration complete called with data:', data);
    if (this.isSubmitting) {
      console.log('Registration is already in progress, ignoring duplicate request');
      return;
    }
    
    this.isSubmitting = true;
    console.log('Starting registration process');
    
    try {
      const hasFile = this.registerService.hasFile(this.questions);
      console.log('Has file:', hasFile);
      console.log('Endpoint:', this.options.regEndpoint);
      
      const response = await this.registerService.genericRegister(
        data,
        this.options.regEndpoint,
        hasFile
      );
      
      console.log('Registration successful:', response);
      
      await Swal.fire({
        title: 'Success',
        text: 'Registration successful! You should receive an email shortly.',
        icon: 'success',
        timer: 3000
      });
      
      console.log('Navigating to:', this.options.returnLink);
      this.router.navigate([this.options.returnLink]);
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMsg =
        typeof error === 'string'
          ? error
          : error?.message || error?.error || 'Registration failed. Please try again.';
      
      await Swal.fire({
        title: 'Registration Error',
        text: errorMsg,
        icon: 'error'
      });
    } finally {
      console.log('Registration process completed, resetting isSubmitting');
      this.isSubmitting = false;
    }
  }
}
