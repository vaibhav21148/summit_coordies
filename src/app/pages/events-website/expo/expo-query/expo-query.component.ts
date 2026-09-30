import { Component, OnInit } from '@angular/core';
import { EXPO_QUESTIONS } from './expo.questions';
import { Endpoint } from '@constants/enums/endpoints.enum';
import {
  AutoFormComponent,
  AutoFormOptions,
} from '@shared/form/auto-form/auto-form.component';
import { RegisterService } from '@services/register.service';
import { UserDataService } from '@services/user-data.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expo-query',
  standalone: true,
  imports: [AutoFormComponent],
  templateUrl: './expo-query.component.html',
})
export class ExpoQueryComponent implements OnInit {
  questions = EXPO_QUESTIONS;

  stepNames = ['Expo Query'];
  stepQuestions = [
    ['name', 'email', 'contact', 'startup_name', 'pitch_deck_or_website', 'stall_type'],
  ];
  userPrefillData: any;

  options: AutoFormOptions = {
    logo: 'images/logos/expo_logo.png',
    returnLink: '/expo',
    submitText: 'Submit Query',
    regEndpoint: Endpoint.EXPO,
    customHandle: true,
    successSwalOptions: {
      title: 'Query Submitted',
      text: 'We will get back to you soon!',
    },
  };

  constructor(
    private registerService: RegisterService,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userPrefillData = this.userDataService.getUserPrefillData();
  }

  async onQuerySubmit(data: any) {
    try {
      const hasFile = this.registerService.hasFile(this.questions);
      await this.registerService.genericRegister(
        data,
        this.options.regEndpoint,
        hasFile
      );
      
      await Swal.fire(this.options.successSwalOptions!);
      this.router.navigate([this.options.returnLink]);
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'Failed to submit query. Please try again.',
        icon: 'error'
      });
    }
  }
}
