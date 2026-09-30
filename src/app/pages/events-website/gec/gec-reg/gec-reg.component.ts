import { Component, OnInit } from '@angular/core';
import { Endpoint } from '@constants/enums/endpoints.enum';
import {
  AutoFormComponent,
  AutoFormOptions,
} from '@shared/form/auto-form/auto-form.component';
import { GEC_QUESTIONS } from './gec.questions';
import { RegisterService } from '@services/register.service';
import { UserDataService } from '@services/user-data.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gec-reg',
  standalone: true,
  imports: [AutoFormComponent],
  templateUrl: './gec-reg.component.html'
})
export class GecRegComponent implements OnInit {
  questions = GEC_QUESTIONS;
  stepNames = ['Personal Details', 'University Details'];
  stepQuestions = [
    ['full_name', 'gender', 'email', 'contact', 'nationality'],
    ['university_name', 'university_country', 'department', 'affiliation_type', 'role']
  ];
  userPrefillData: any;

  options: AutoFormOptions = {
    logo: 'images/logos/logo.png',
    returnLink: '/gec',
    regEndpoint: Endpoint.GEC,
    submitText: 'Register',
    customHandle: true
  };

  constructor(
    private registerService: RegisterService,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  ngOnInit() {
    Swal.fire({
      title: 'GEC Registration',
      text: 'This is only for students having college outside India.',
      icon: 'info',
      confirmButtonText: 'Ok'
    });
    
    console.log('GEC Questions:', this.questions);
    console.log('Step Questions:', this.stepQuestions);
    console.log('Questions count:', this.questions.length);
    this.questions.forEach((q, i) => {
      console.log(`Q${i}: key=${q.key}, label=${q.label}`);
    });
    this.userPrefillData = this.userDataService.getUserPrefillData();
  }

  async onRegistrationComplete(data: any) {
    console.log('Registration data:', data);
    try {
      const hasFile = this.registerService.hasFile(this.questions);
      await this.registerService.genericRegister(
        data,
        this.options.regEndpoint,
        hasFile
      );
      
      await Swal.fire({
        title: 'Success',
        text: 'Registration successful! You should receive an email shortly.',
        icon: 'success',
        timer: 3000
      });
      
      this.router.navigate([this.options.returnLink]);
    } catch (error) {
      console.error('Registration error:', error);
      await Swal.fire({
        title: 'Error',
        text: 'Registration failed. Please try again.',
        icon: 'error'
      });
    }
  }
}
