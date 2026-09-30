import { Component, OnInit } from '@angular/core';
import { SEED_STARS_QUESTIONS } from './seed-stars.questions';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { PassType } from '@constants/enums/passtype.enum';
import {
  AutoFormComponent,
  AutoFormOptions,
} from '@shared/form/auto-form/auto-form.component';
import { AuthService } from '@services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from '@services/register.service';
import { UserDataService } from '@services/user-data.service';

@Component({
  selector: 'app-seed-stars-reg',
  standalone: true,
  imports: [AutoFormComponent, CommonModule],
  templateUrl: './seed-stars-reg.component.html',
})
export class SeedStarsRegComponent implements OnInit {
  questions = SEED_STARS_QUESTIONS;
  stepNames = ['Personal Details', 'Startup Details', 'Pitch & Documents'];
  stepQuestions = [
    ['cofounders', 'email', 'contact'],
    ['startup_name', 'description', 'sector', 'dpiit_reg', 'dpiit_id', 'traction', 'reg_status', 'is_startup_funded', 'website'],
    ['pitch_deck', 'reg_proof']
  ];
  heading = 'Seed Stars Registration';
  description = 'Complete your registration for Seed Stars at E-Summit 2026';
  userPrefillData: any;
  isSubmitting = false;
  
  options: AutoFormOptions = {
    logo: 'images/seedstars_logo.png',
    returnLink: '/seedstars',
    regEndpoint: Endpoint.SEEDSTARS,
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
    this.userPrefillData = await this.userDataService.getUserPrefillData();
    await this.checkPassRequirement();
  }

  async checkPassRequirement() {
    if (!this.authService.isLoggedIn()) {
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
        text: 'You have already registered for Seed Stars.',
        icon: 'info',
        confirmButtonText: 'Ok',
      });
      this.router.navigate([this.options.returnLink]);
      return;
    }
    
    this.showForm = true;
  }

  async onRegistrationComplete(data: any) {
    if (this.isSubmitting) {
      return;
    }
    
    this.isSubmitting = true;
    
    try {
      const hasFile = this.registerService.hasFile(this.questions);
      
      const response = await this.registerService.genericRegister(
        data,
        this.options.regEndpoint,
        hasFile
      );

      const hasPlatinum =
        this.authService.checkCurrentPass('eq', PassType.PROFESSIONAL) ||
        this.authService.checkCurrentPass('gt', PassType.PROFESSIONAL);

      if (response?.pass_pending || !hasPlatinum) {
        await Swal.fire({
          title: 'Platinum Pass Required',
          text: 'A Platinum Pass is required for Seed Stars. Please purchase the Platinum Pass to confirm your registration.',
          icon: 'warning',
          confirmButtonText: 'Get Platinum Pass',
          showCancelButton: true,
          cancelButtonText: 'Later',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/pass']);
          } else {
            this.router.navigate([this.options.returnLink]);
          }
        });
        return;
      }
      
      await Swal.fire({
        title: 'Success',
        text: 'Registration successful! You should receive an email shortly.',
        icon: 'success',
        timer: 3000
      });
      
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
      this.isSubmitting = false;
    }
  }
}
