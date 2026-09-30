import { Component } from '@angular/core';
import { Endpoint } from '@constants/enums/endpoints.enum';
import {
  AutoFormComponent,
  AutoFormOptions,
} from '@shared/form/auto-form/auto-form.component';
import { IHACK_SUB_QUESTIONS } from './ihack-sub.questions';
import { RegisterService } from '@services/register.service';
import { UserDataService } from '@services/user-data.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ihack-sub',
  standalone: true,
  imports: [AutoFormComponent],
  templateUrl: './ihack-sub.component.html',
})
export class IhackSubComponent {
  questions = IHACK_SUB_QUESTIONS;
  
  stepNames: string[] = [
    'Team Details',
    'Project Submission'
  ];

  stepQuestions: string[][] = [
    ['name', 'email', 'team_members', 'contact', 'college'],
    ['track', 'git_profile', 'git_submission', 'solution_deck']
  ];

  heading = 'iHack Submission';
  description = 'Submit your project for iHack';
  userPrefillData: any = {};
  isSubmitting = false;
  options!: AutoFormOptions;

  constructor(
    private registerService: RegisterService,
    private userDataService: UserDataService,
    private router: Router
  ) {
    this.showClosedAlert();
  }

  async showClosedAlert() {
    await Swal.fire({
      title: 'Registrations Over',
      text: 'iHack submissions have been closed.',
      icon: 'info',
      confirmButtonText: 'OK'
    });
    this.router.navigate(['/ihack']);
  }

  ngOnInit() {
    this.userPrefillData = this.userDataService.getUserPrefillData();
  }

  async onRegistrationComplete(data: any) {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    try {
      const hasFile = this.registerService.hasFile(this.questions);
      const response = await this.registerService.genericRegister(
        data,
        this.options.regEndpoint,
        hasFile
      );
      
      await Swal.fire({
        title: 'Success',
        text: 'Submission successful!',
        icon: 'success',
        timer: 3000
      });
      
      this.router.navigate([this.options.returnLink]);
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'Submission failed. Please try again.',
        icon: 'error'
      });
    } finally {
      this.isSubmitting = false;
    }
  }
}
