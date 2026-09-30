import { Component } from '@angular/core';
import { Endpoint } from '@constants/enums/endpoints.enum';
import {
  AutoFormComponent,
  AutoFormOptions,
} from '@shared/form/auto-form/auto-form.component';
import { TTMM_QUESTIONS } from './ttmm.questions';
import { RegisterService } from '@services/register.service';
import { UserDataService } from '@services/user-data.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ttmm-reg',
  standalone: true,
  imports: [AutoFormComponent],
  templateUrl: './ttmm-reg.component.html',
  styleUrl: './ttmm-reg.component.scss'
})
export class TTMMRegComponent {
  questions = TTMM_QUESTIONS;
  stepNames = ['Personal Details', 'Startup Details', 'Fundraising Details'];
  stepQuestions = [
    ['cofounders', 'email', 'contact', 'full_time' , 'founder_background', 'previously_registered'],
    ['startup_name', 'description', 'website', 'head_office', 'sector', 'reg_status', 'date_of_incorporation', 'revenue', 'pitch_deck'],
    ['stage_of_startup', 'is_startup_funded', 'last_funded_valuation', 'additional_info']
  ];
  heading = 'TTMM Registration';
  description = 'Complete your registration for The Ten Minute Million';
  userPrefillData: any;
  isSubmitting = false;
  
  options: AutoFormOptions = {
    logo: 'images/logos/ttmm_logo.png',
    returnLink: '/ttmm',
    regEndpoint: Endpoint.TTMM,
    submitText: 'Register',
    customHandle: true // Always use custom handle for multi-step
  };

  constructor(
    private registerService: RegisterService,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userPrefillData = this.userDataService.getUserPrefillData();
  }

  async onRegistrationComplete(data: any) {
    // Prevent multiple submissions
    if (this.isSubmitting) {
      console.log('Registration is already in progress, ignoring duplicate request');
      return;
    }
    
    this.isSubmitting = true;
    
    // console.log('Registration completed with data:', data);
    // console.log('Sending to:', `http://localhost:8000/esummit26/${this.options.regEndpoint}`);
    
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
