import { Component } from '@angular/core';
import { Endpoint } from '@constants/enums/endpoints.enum';
import {
  AutoFormComponent,
  AutoFormOptions,
} from '@shared/form/auto-form/auto-form.component';
import { IJF_COMP_QUESTIONS } from './ijf-comp.questions';
import Swal from 'sweetalert2';
import { RegisterService } from '@services/register.service';
import { UserDataService } from '@services/user-data.service';
import { Router } from '@angular/router';
import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";

@Component({
  selector: 'app-ijf-comp',
  standalone: true,
  imports: [AutoFormComponent, VantaBgComponent],
  templateUrl: './ijf-comp.component.html',
})
export class IjfCompComponent {
  questions = IJF_COMP_QUESTIONS;
  stepNames = ['Company Information', 'Contact Details', 'Hiring Needs'];
  stepQuestions = [
    ['company_name', 'industry_sector', 'headquarters_country', 'headquarters_state', 'headquarters_city', 'company_website', 'linkedin_url', 'instagram_url', 'other_social_media', 'company_description', 'year_established', 'company_size'],
    ['contact_person_name', 'contact_designation', 'contact_email', 'contact_phone', 'preferred_communication'],
    ['hiring_for', 'joining_timeline', 'departments_hiring', 'expected_internships', 'expected_jobs', 'work_location', 'work_locations_specify', 'internship_duration', 'internship_duration_other', 'compensation_type', 'monthly_stipend_range', 'annual_package_range', 'benefits', 'evaluation_mode', 'suggestions']
  ];
  heading = 'IJF Company Registration';
  description = 'Complete your company registration for The Internship and Job Fair';
  userPrefillData: any;
  
  options: AutoFormOptions = {
    logo: '',
    returnLink: '/ijf',
    loginRequired: true,
    regEndpoint: Endpoint.IJF_COMP,
    submitText: 'Register',
    customHandle: true
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
    }
  }
}
