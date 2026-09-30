import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { RegisterService } from '@services/register.service';
import { UserDataService } from '@services/user-data.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AutoFormComponent, AutoFormOptions } from '@shared/form/auto-form/auto-form.component';
import { Question } from '@shared/form/question/question';
import { IHACK_QUESTIONS } from './ihack.questions';

@Component({
  selector: 'app-ihack-reg',
  standalone: true,
  imports: [AutoFormComponent, CommonModule],
  templateUrl: './ihack-reg.component.html',
  styleUrl: './ihack-reg.component.scss'
})

export class IhackRegComponent {
  questions: Question<any>[] = IHACK_QUESTIONS;
  options!: AutoFormOptions;
  heading = 'iHack Registration';
  description = 'Complete your registration for iHack';
  stepNames = ['Registration'];
  stepQuestions = [
    ['team_name', 'team_members', 'contact' ,'track', 'college', 'city', 'state'],
  ];
  userPrefillData: any = {};

  constructor(
    private registerService: RegisterService,
    private userDataService: UserDataService,
    private router: Router
  ){
    this.showClosedAlert();
  }

  async showClosedAlert() {
    await Swal.fire({
      title: 'Registrations Over',
      text: 'iHack registrations have been closed.',
      icon: 'info',
      confirmButtonText: 'OK'
    });
    this.router.navigate(['/ihack']);
  }

  ngOnInit() {}

  async prefillForm() {
    const userPrefillData = await this.userDataService.getUserPrefillData();
    if (userPrefillData) {
      this.userPrefillData = {
        team_members: [{ name: userPrefillData.name || '', email: userPrefillData.email || '' }],
        contact: userPrefillData.contact || ''
      };
    }
  }

  async onRegistrationComplete(formData: any) {
    try {
      await this.registerService.genericRegister(formData, Endpoint.IHACK, false);
      
      await Swal.fire({
        title: 'Registered Successfully',
        text: 'Submission link will be activated soon!',
        icon: 'success',
        timer: 3000
      });
      
      this.router.navigate(['/ihack']);
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'Registration failed. Please try again.',
        icon: 'error'
      });
    }
  }
}
