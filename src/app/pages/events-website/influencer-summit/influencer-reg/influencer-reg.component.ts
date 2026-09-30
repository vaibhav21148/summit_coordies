import {
  Component,
  HostListener,
  Injectable,
  Input,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { QuestionComponent } from '@shared/form/question/question.component';
import { FormComponent as BaseFormComponent } from '@shared/form/form.component';
import { RegisterService } from '@services/register.service';
import { PaymentsService } from '@services/payments.service';
import { AuthService } from '@services/auth.service';

import { handleAPIException } from 'src/app/utils/error';
import { Question } from '@shared/form/question/question';
import { Endpoint } from '@constants/enums/endpoints.enum';
import {
  AutoFormComponent,
  AutoFormOptions,
} from '@shared/form/auto-form/auto-form.component';
import {
  INF_SUMMIT_QUESTIONS,
  INF_SUMMIT_TWO_QUESTIONS,
  INF_SUMMIT_NOMINATE_QUESTIONS,
} from './influencer.questions';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-influencer-reg',
  standalone: true,
  imports: [
    AutoFormComponent,
    ReactiveFormsModule,
    CommonModule,
    QuestionComponent,
    BaseFormComponent,
  ],
  templateUrl: './influencer-reg.component.html',
  styleUrl: '../../../../shared/form/form.component.scss',
})
export class InfluencerRegComponent {
  allQuestions: Question<any>[] = [];
  skippedEmail: string = '';
  @ViewChild(AutoFormComponent) autoForm!: AutoFormComponent;

  constructor(
    private registerService: RegisterService,
    private paymentsService: PaymentsService,
    private router: Router,
    private http: HttpClient
  ) {}

  options: AutoFormOptions = {
    logo: 'images/logos/influencer_summit.png',
    returnLink: '/',
    submitText: 'Nominate',
    regEndpoint: Endpoint.CREATE_INF_SUMMIT_PAYMENT,
    customHandle: true,
  };

  steps = ['Personal Details', 'Social Media Details', 'Nominate'];
  stepQuestions = [
    ['name', 'contact', 'email'],
    ['handles', 'website'],
    ['awards', 'coupon'],
  ];

  ngOnInit() {
    this.allQuestions = [
      ...INF_SUMMIT_QUESTIONS,
      ...INF_SUMMIT_TWO_QUESTIONS,
      ...INF_SUMMIT_NOMINATE_QUESTIONS,
    ];
  }

  skipToNomination() {
    Swal.fire({
      text: 'Enter your email to skip registration and proceed to nomination',
      input: 'email',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Skip',
      cancelButtonText: 'Go Back',
      showLoaderOnConfirm: true,
      preConfirm: async (email) => {
        const res = await lastValueFrom<any>(
          this.http.get(this.registerService.url(Endpoint.INFLUENCER), {
            params: { email, for_nomination: true },
          })
        );
        if (res.previous_reg) {
          this.skippedEmail = email;
          this.handleSkipToNomination(res);
          return true;
        } else {
          Swal.showValidationMessage(
            'Did not find a registration for this email'
          );
          return false;
        }
      },
    });
  }

  handleSkipToNomination(response: any) {
    if (this.autoForm) {
      this.autoForm.currentStep = 3;
      this.autoForm.updateCurrentStepQuestions();
      this.autoForm.updateModifiedOptions();
      window.scrollTo(0, 0);
    }
  }

  async handleFormResponse(response: any) {
    try {
      const formData = { ...response, for_nomination: true };
      if (this.skippedEmail) {
        formData.email = this.skippedEmail;
      }
      const res = await this.registerService.genericRegister(
        formData,
        Endpoint.CREATE_INF_SUMMIT_PAYMENT,
        false
      );

      if (res.order) {
        await Swal.fire({
          title: 'Proceeding to Payment',
          text: res.success ?? 'Please wait while we load the payment gateway for you.',
          icon: 'info',
          timer: 2000,
        });
        const confirmationSwal = await this.paymentsService.warnForPayment('hosted');
        if (!confirmationSwal.isConfirmed) return;

        const success = await this.paymentsService.attemptPayment(
          res.order,
          Endpoint.VERIFY_INF_SUMMIT_PAYMENT,
          'Payment for Influencer Summit',
          'hosted'
        );
        if (!success) return;
      }

      window.scrollTo(0, 0);
      await Swal.fire({
        title: 'Success',
        text: 'Registration successful. You should receive an email shortly.',
        timer: 3000,
        icon: 'success',
        showCancelButton: false,
      });
      this.router.navigate(['/']);
    } catch (e) {
      handleAPIException(e);
    }
  }
}
