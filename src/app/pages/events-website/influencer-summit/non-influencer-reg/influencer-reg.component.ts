import { Component } from '@angular/core';
import { Endpoint } from '@constants/enums/endpoints.enum';
import {
  AutoFormComponent,
  AutoFormOptions,
} from '@shared/form/auto-form/auto-form.component';
import { INF_SUMMIT_QUESTIONS } from './influencer.questions';
import { RegisterService } from '@services/register.service';
import { UserDataService } from '@services/user-data.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-influencer-reg',
  standalone: true,
  imports: [AutoFormComponent],
  templateUrl: './influencer-reg.component.html',
})

export class InfluencerRegComponent {
  questions = INF_SUMMIT_QUESTIONS;
  stepNames = ['Personal Details', 'Social Media Details'];
  stepQuestions = [
    ['name', 'contact', 'email'],
    ['handles', 'website']
  ];
  heading = 'Attend Influencer Summit';
  description = 'Complete your registration for Influencer Summit';
  userPrefillData: any;
  isSubmitting = false;
  
  options: AutoFormOptions = {
    logo: 'images/logos/influencer_summit.png',
    returnLink: '/infsummit',
    submitText: 'Register',
    regEndpoint: Endpoint.INFLUENCER,
  };

    constructor(
      private registerService: RegisterService,
      private userDataService: UserDataService,
      private router: Router
    ) {}

    async onRegistrationComplete(data: any) {
      if (this.isSubmitting) {
        console.log('Registration is already in progress, ignoring duplicate request');
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
        
        console.log('Registration successful:', response);
        
        await Swal.fire({
          title: 'Success',
          text: 'Registration successful! You should receive an email shortly.',
          icon: 'success',
          timer: 3000
        });
        
        this.router.navigate([this.options.returnLink]);
      } catch (error) {
        console.error('Registration failed:', error);
        
        await Swal.fire({
          title: 'Error',
          text: 'Registration failed. Please try again.',
          icon: 'error'
        });
      } finally {
        this.isSubmitting = false;
      }
    }
}
