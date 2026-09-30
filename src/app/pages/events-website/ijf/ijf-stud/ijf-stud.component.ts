import { Component } from '@angular/core';
import { Endpoint } from '@constants/enums/endpoints.enum';
import {
  AutoFormComponent,
  AutoFormOptions,
} from '@shared/form/auto-form/auto-form.component';
import { IJF_STUD_QUESTIONS } from './ijf-stud.questions';
import Swal from 'sweetalert2';
import { RegisterService } from '@services/register.service';
import { UserDataService } from '@services/user-data.service';
import { Router } from '@angular/router';
import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";

@Component({
  selector: 'app-ijf-stud',
  standalone: true,
  imports: [AutoFormComponent, VantaBgComponent],
  templateUrl: './ijf-stud.component.html',
})
export class IjfStudComponent {
  questions = IJF_STUD_QUESTIONS;
  stepNames = ['Personal Details'];
  stepQuestions = [
    ['state', 'city', 'college', 'year', 'degree', 'opportunity']
  ];
  heading = 'IJF Student Registration';
  description = 'Complete your registration for The Internship and Job Fair';
  userPrefillData: any;
  
  options: AutoFormOptions = {
    logo: '',
    returnLink: '/ijf',
    loginRequired: true,
    regEndpoint: Endpoint.IJF_STUD,
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
    }
  }
}
