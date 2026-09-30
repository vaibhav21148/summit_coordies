import { Component } from '@angular/core';
import { COMPI_QUESTIONS } from './compi.questions';
import { Endpoint } from '@constants/enums/endpoints.enum';
import {
  AutoFormComponent,
  AutoFormOptions,
} from '@shared/form/auto-form/auto-form.component';
import { RegisterService } from '@services/register.service';
import Swal from 'sweetalert2';
import { UserDataService } from '@services/user-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compi-reg',
  standalone: true,
  imports: [AutoFormComponent],
  templateUrl: './compi-reg.component.html',
})
export class CompiRegComponent {
  questions = COMPI_QUESTIONS;
    stepNames = ['Personal Details', 'Competition Details'];
    stepQuestions = [
      ['name', 'email', 'contact', 'college' , 'city', 'state', 'year_study'],
      ['compi_name', 'team_code', 'deck_submission'],
    ];
    heading = ' Competition Registration';
    description = 'Register in your favourite Competition to showcase your skills and win exciting prizes!';
    userPrefillData: any;
    isSubmitting = false;
  
  options: AutoFormOptions = {
    loginRequired: true,
    logo: 'images/logos/compi.png',
    returnLink: '/compi',
    submitText: 'Submit',
    regEndpoint: Endpoint.COMPI,
    successSwalOptions: {
      title: 'Registered Successfully',
      text: 'You can explore other competitions as well!',
    },
  };

    constructor(
      private registerService: RegisterService,
      private userDataService: UserDataService,
      private router: Router
    ) {}

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
