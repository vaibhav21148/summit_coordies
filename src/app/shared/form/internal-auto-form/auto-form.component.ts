import {
  Component,
  HostListener,
  Injectable,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
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
import { QuestionComponent } from '../question/question.component';
import { FormComponent as BaseFormComponent } from '../form.component';
import { RegisterService } from '@services/register.service';
import { PaymentsService } from '@services/payments.service';
import { AuthService } from '@services/auth.service';

import { handleAPIException } from 'src/app/utils/error';
import { Question } from '../question/question';
import { Endpoint } from '@constants/enums/endpoints.enum';

const SUCCESS_SWAL_DEFAULTS: SweetAlertOptions = {
  title: 'Success',
  text: 'Registration successful.',
  timer: 3000,
  icon: 'success',
  showCancelButton: false,
};

export interface AutoFormOptions {
  key?: string;
  loginRequired?: boolean;
  logo: string;
  returnLink?: string;
  submitText?: string;
  regEndpoint: Endpoint;
  paymentEndpoint?: Endpoint;
  paymentDescription?: string;
  timerForPrePaymentMessage?: boolean;
  successSwalOptions?: SweetAlertOptions;
  showNavbar?: boolean;
  customHandle?: boolean;
}

@Component({
  selector: 'app-int-auto-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    QuestionComponent,
    // RouterLink,
  ],
  templateUrl: './auto-form.component.html',
  styleUrl: '../_internal-auto-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalAutoFormComponent {
  @Input() questions: Question<any>[] = [];
  @Input() allQuestions?: Question<any>[];
  @Input() extraData?: any;
  @Input() options!: AutoFormOptions;
  @Input() currentStep?: number;
  @Input() totalSteps?: number;
  @Input() prefillData?: any;

  @Output() previousStep: EventEmitter<void> = new EventEmitter();
  @ViewChild('formElement', { static: false }) formElement!: ElementRef;

  loginRequired!: boolean;
  logo!: string;
  returnLink!: string;
  submitText!: string;
  regEndpoint!: Endpoint;
  paymentEndpoint?: Endpoint;
  paymentDescription!: string;
  timerForPrePaymentMessage!: boolean;
  successSwalOptions!: SweetAlertOptions;
  showNavbar!: boolean;
  customHandle!: boolean;

  @Output() regResponse: EventEmitter<any> = new EventEmitter();
  regForm!: FormGroup;
  hasFile = false;
  loginCheckFailed = false;
  isSubmitting = false;
  lastSubmitTime = 0;
  minSubmitInterval = 3000; // 3 seconds between submissions

  @Input() set patchValue(value: any) {
    this.regForm?.patchValue(value);
  }

  constructor(
    private router: Router,
    private registerService: RegisterService,
    private paymentsService: PaymentsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeOptions();

    // Since valid log-in is required to check if user has already registered,
    // we have a combined function to check for both with as little blocking as possible
    if (this.loginRequired)
      this.loginCheckFailed = !this.checkLoginAndRepeatReg();

    // Create form with ALL questions to avoid missing control errors
    this.regForm = this.registerService.formGroupFromQuestions(this.getAllQuestions());
    this.hasFile = this.registerService.hasFile(this.getAllQuestions());
  }

  getAllQuestions(): Question<any>[] {
    // Get all questions from parent component if available
    return this.allQuestions || this.questions;
  }

  checkLoginAndRepeatReg() {
    // The fact that we first check if there is a valid login, and then check if the user has already registered
    // is redundant, and optimally the one request for repeat reg should be enough to check both
    // TODO: Refactor to combine the two checks using just one request

    // Initial synchronous check
    if (!this.authService.isLoggedIn()) {
      console.log('Not logged in');
      this.authService.redirectToLogin({
        returnUrl: this.router.url,
      });
      return false;
    }

    // Eventual async check (might complete before the user starts on the page, but is non-blocking)
    this.authService.checkValidLogin().then(async (valid) => {
      if (!valid) {
        this.authService.redirectToLogin({
          returnUrl: this.router.url,
        });
        return;
      }

      const hasRegistered = await this.registerService.hasRegistered(
        this.regEndpoint
      );

      if (hasRegistered) {
        await Swal.fire({
          title: 'Already Registered',
          text: 'You have already registered for this event.',
          icon: 'info',
          confirmButtonText: 'Ok',
        });
        this.router.navigate([this.returnLink]);
      }
    });
    return true;
  }

  ngAfterViewInit() {
    if (!this.loginCheckFailed) this.restoreResponse();
    
    // Prefill form with existing data after view init
    if (this.prefillData) {
      console.log('Prefilling form with data:', this.prefillData);
      this.prefillForm();
    }
  }

  prefillForm() {
    // Handle regular fields
    const fieldsToCheck = ['name', 'email', 'contact', 'phone', 'mobile'];
    
    fieldsToCheck.forEach(field => {
      const control = this.regForm.get(field);
      if (this.prefillData[field] && control) {
        control.patchValue(this.prefillData[field]);
      }
    });
    
    // Handle first cofounder in list type questions
    const cofoundersArray = this.regForm.get('cofounders');
    if (this.prefillData.name && cofoundersArray) {
      const controls = (cofoundersArray as any).controls;
      if (controls && controls.length > 0) {
        const nameControl = controls[0].get('name');
        if (nameControl) {
          nameControl.patchValue(this.prefillData.name);
        }
      }
    }
    
    // Handle first member in accommodation list type questions
    const membersArray = this.regForm.get('members');
    if (this.prefillData && membersArray) {
      const controls = (membersArray as any).controls;
      if (controls && controls.length > 0) {
        const firstMember = controls[0];
        if (this.prefillData.name && firstMember.get('name')) {
          firstMember.get('name').patchValue(this.prefillData.name);
        }
        if (this.prefillData.email && firstMember.get('email')) {
          firstMember.get('email').patchValue(this.prefillData.email);
        }
        if (this.prefillData.contact && firstMember.get('contact')) {
          firstMember.get('contact').patchValue(this.prefillData.contact.toString());
        }
      }
    }
    
    // Handle team_members array for iHack and similar events
    const teamMembersArray = this.regForm.get('team_members');
    if (this.prefillData && this.prefillData.team_members && teamMembersArray) {
      const controls = (teamMembersArray as any).controls;
      if (controls && controls.length > 0) {
        this.prefillData.team_members.forEach((memberData: any, index: number) => {
          if (controls[index]) {
            const memberControl = controls[index];
            if (memberData.name && memberControl.get('name')) {
              memberControl.get('name').patchValue(memberData.name);
            }
            if (memberData.email && memberControl.get('email')) {
              memberControl.get('email').patchValue(memberData.email);
            }
          }
        });
      }
    }
  }

  restoreResponse() {
    const responseRestored = this.registerService.restoreResponseFromLocal(
      this.regForm,
      this.regEndpoint
    );

    if (!responseRestored) return;

    this.patchNumberControls();
    this.patchFileControls();

    // TODO: Implement patch sync for list type, and then remove this
    // Might have to do with ngOnChanges
    // https://ultimatecourses.com/blog/detect-input-property-changes-ngonchanges-setters
    // https://stackoverflow.com/questions/56602850/ngonchanges-overrides-form-control-value-when-user-types

    const hasList = this.registerService.hasQuestionControlType(
      this.questions,
      'list'
    );
    const hasFile = this.registerService.hasQuestionControlType(
      this.questions,
      'file'
    );

    // TODO: Implement patch sync for oredering type, and then remove this
    // Same as above
    const hasOrdering = this.registerService.hasQuestionControlType(
      this.questions,
      'ordering'
    );

    let mainText =
      hasList || hasFile || hasOrdering
        ? 'Some of your previous response have been restored from a local save.'
        : 'Your previous response has been restored from a local save.';
    // let warningText = '';

    if (hasFile) {
      mainText += " Please re-attach any files you've previously attached.";
    }
    if (hasOrdering) {
      mainText += " Please re-order any preferences you've previously ordered.";
    }

    Swal.fire({
      title: 'Response Restored',
      text: mainText,
      icon: 'info',
      confirmButtonText: 'Ok',
    });
  }

  initializeOptions() {
    const {
      loginRequired = false,
      logo,
      returnLink = '/',
      submitText = 'Register',
      regEndpoint,
      paymentEndpoint,
      paymentDescription = 'Payment',
      timerForPrePaymentMessage = false,
      successSwalOptions = {},
      showNavbar = true,
      customHandle = false,
    } = this.options;

    // Assign values after destructuring with defaults
    this.loginRequired = loginRequired;
    this.logo = logo;
    this.returnLink = returnLink;
    this.submitText = submitText;
    this.regEndpoint = regEndpoint;
    this.paymentEndpoint = paymentEndpoint;
    this.paymentDescription = paymentDescription;
    this.timerForPrePaymentMessage = timerForPrePaymentMessage;
    this.successSwalOptions = {
      ...SUCCESS_SWAL_DEFAULTS,
      ...(successSwalOptions || {}),
    } as SweetAlertOptions;
    this.showNavbar = showNavbar;
    this.customHandle = customHandle;
  }

  // TODO: Doesn't work if the numeric is more that surface level i.e. in a list controlType
  patchNumberControls() {
    this.questions.forEach((question) => {
      if (question.type === 'number') {
        const value = this.regForm.get(question.key)?.value;
        if (value === '') {
          this.regForm.get(question.key)?.patchValue(null);
        }
      }
    });
  }

  patchFileControls() {
    this.questions.forEach((question) => {
      if (question.controlType === 'file') {
        const value = this.regForm.get(question.key)?.value;

        if (!(value instanceof File)) {
          this.regForm.get(question.key)?.patchValue(null);
        }
      }
    });
  }

  getReadableLabel(q: Question<any>, parentForm?: FormGroup): string {
    const key = (q.key || '').toLowerCase();
    const keyMap: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      contact: 'Contact Number',
      phone: 'Phone Number',
      mobile: 'Mobile Number',
      linkedin: 'LinkedIn Profile Link',
      startup_name: 'Startup Name',
      dpiit_id: 'DPIIT ID',
      dpiit_reg: 'DPIIT Registration',
      sector1: 'Primary Sector',
      sector2: 'Secondary Sector',
      reg_status: 'Current Registration Status',
      stage_of_startup: 'Stage of Startup',
      revenue: 'Revenue',
      is_startup_funded: 'Funding Status / Amount',
      website: 'Website',
      head_office: 'Head Office Location',
      pitch_deck: 'Pitch Deck',
      target_incubator: 'Target Incubator',
      previously_registered: 'Previous Registration Status',
      company_type: 'Company Type',
      brief: 'Brief Description',
      description: 'Description',
      city: 'City',
      state: 'State',
      pincode: 'Pincode',
      cofounders: 'Founder/Co-founders',
      team_members: 'Team Members',
      members: 'Members',
    };

    // If direct key match exists in mapping, return clean name
    if (keyMap[key]) {
      return keyMap[key];
    }

    let rawLabel = q.label;
    if (typeof rawLabel === 'function') {
      try {
        rawLabel = (rawLabel as any)(parentForm || this.regForm, q);
      } catch {
        rawLabel = '';
      }
    }
    if (typeof rawLabel === 'string' && rawLabel.trim() && !rawLabel.includes('=>') && !rawLabel.includes('{')) {
      return rawLabel.trim().replace(/\s*\(.*?\)\s*/g, ' ').trim();
    }

    let rawPlaceholder = q.placeholder;
    if (typeof rawPlaceholder === 'function') {
      try {
        rawPlaceholder = (rawPlaceholder as any)(parentForm || this.regForm, q);
      } catch {
        rawPlaceholder = '';
      }
    }
    if (typeof rawPlaceholder === 'string' && rawPlaceholder.trim() && !rawPlaceholder.includes('=>') && !rawPlaceholder.includes('{')) {
      return rawPlaceholder.trim().replace(/\s*\(.*?\)\s*/g, ' ').trim();
    }

    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  async register(event: any) {
    event.preventDefault();
    
    // Spam check - prevent rapid submissions
    const currentTime = Date.now();
    if (currentTime - this.lastSubmitTime < this.minSubmitInterval) {
      const remainingTime = Math.ceil((this.minSubmitInterval - (currentTime - this.lastSubmitTime)) / 1000);
      Swal.fire({
        title: 'Please Wait',
        text: `Please wait ${remainingTime} more second(s) before submitting again.`,
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }
    
    // Prevent multiple submissions
    if (this.isSubmitting) {
      console.log('Form is already being submitted, ignoring duplicate request');
      return;
    }
    
    this.lastSubmitTime = currentTime;
    
    this.isSubmitting = true;
    
    // Disable the button immediately to prevent rapid clicks
    if (event.target) {
      event.target.disabled = true;
    }
    console.log('Register clicked - customHandle:', this.options.customHandle, 'regEndpoint:', this.regEndpoint);
    // Don't mark as touched initially - only after validation fails

    // Check only current step questions for validation
    const currentStepKeys = this.questions.map(q => q.key);
    const errors: string[] = [];
    
    currentStepKeys.forEach(key => {
      const control = this.regForm.get(key);
      const question = this.questions.find(q => q.key === key);
      
      if (!question || !control) return;

      // Skip questions that are hidden conditionally via showIf
      if (question.showIf && !question.showIf(this.regForm)) {
        return;
      }
      
      if (control.invalid) {
        // Handle list type questions (like cofounders, members)
        if (question.controlType === 'list' && control instanceof FormArray) {
          control.controls.forEach((memberControl, index) => {
            if (memberControl.invalid && question.subQuestions) {
              question.subQuestions.forEach(subQ => {
                const subControl = memberControl.get(subQ.key);
                if (subControl && subControl.invalid) {
                  let memberLabel = '';
                  if (question.key === 'cofounders') {
                    memberLabel = index === 0 ? 'Founder' : `Co-founder ${index + 1}`;
                  } else if (question.key === 'team_members') {
                    memberLabel = index === 0 ? 'Team Leader' : `Team Member ${index + 1}`;
                  } else {
                    const parentLabel = this.getReadableLabel(question);
                    memberLabel = `${parentLabel} - Member ${index + 1}`;
                  }

                  const fieldName = this.getReadableLabel(subQ, memberControl as FormGroup);
                  
                  if (subControl.errors?.['required']) {
                    errors.push(`${memberLabel}: ${fieldName} is required`);
                  } else if (subControl.errors?.['email']) {
                    errors.push(`${memberLabel}: ${fieldName} must be a valid email address`);
                  } else if (subControl.errors?.['pattern']) {
                    if (subQ.key === 'contact' || subQ.key === 'phone' || subQ.key === 'mobile') {
                      errors.push(`${memberLabel}: ${fieldName} must be a valid 10-digit phone number`);
                    } else {
                      errors.push(`${memberLabel}: ${fieldName} format is invalid`);
                    }
                  } else if (subControl.errors?.['minlength']) {
                    const minLength = subControl.errors['minlength'].requiredLength;
                    errors.push(`${memberLabel}: ${fieldName} must be at least ${minLength} characters`);
                  } else if (subControl.errors?.['maxlength']) {
                    const maxLength = subControl.errors['maxlength'].requiredLength;
                    errors.push(`${memberLabel}: ${fieldName} must not exceed ${maxLength} characters`);
                  } else {
                    errors.push(`${memberLabel}: ${fieldName} is invalid`);
                  }
                }
              });
            }
          });
        } else {
          // Handle regular form controls
          const fieldName = this.getReadableLabel(question);
          
          if (control.errors?.['required']) {
            errors.push(`${fieldName} is required`);
          } else if (control.errors?.['email']) {
            errors.push(`${fieldName} must be a valid email address`);
          } else if (control.errors?.['pattern']) {
            if (question.key === 'contact' || question.key === 'phone' || question.key === 'mobile') {
              errors.push(`${fieldName} must be a valid 10-digit phone number`);
            } else if (question.type === 'url') {
              errors.push(`${fieldName} must be a valid URL`);
            } else {
              errors.push(`${fieldName} format is invalid`);
            }
          } else if (control.errors?.['minlength']) {
            const minLength = control.errors['minlength'].requiredLength;
            errors.push(`${fieldName} must be at least ${minLength} characters`);
          } else if (control.errors?.['maxlength']) {
            const maxLength = control.errors['maxlength'].requiredLength;
            errors.push(`${fieldName} must not exceed ${maxLength} characters`);
          } else if (control.errors?.['min']) {
            const minValue = control.errors['min'].min;
            errors.push(`${fieldName} must be at least ${minValue}`);
          } else if (control.errors?.['max']) {
            const maxValue = control.errors['max'].max;
            errors.push(`${fieldName} must not exceed ${maxValue}`);
          } else {
            errors.push(`${fieldName} is invalid`);
          }
        }
      }
    });

    if (errors.length > 0) {
      // Only mark as touched when validation fails to show red styling
      this.regForm.markAllAsTouched();
      
      this.isSubmitting = false;
      if (event.target) {
        event.target.disabled = false;
      }
      
      // Scroll to first error field
      const firstErrorKey = currentStepKeys.find(key => {
        const control = this.regForm.get(key);
        return control && control.invalid;
      });
      
      if (firstErrorKey) {
        const errorElement = document.querySelector(`[data-field="${firstErrorKey}"]`) || 
                           document.querySelector(`input[formControlName="${firstErrorKey}"]`) ||
                           document.querySelector(`select[formControlName="${firstErrorKey}"]`) ||
                           document.querySelector(`textarea[formControlName="${firstErrorKey}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (errorElement as HTMLElement).focus();
        }
      }
      
      Swal.fire({
        title: 'Please Fix These Errors',
        html: `<div style="text-align: left; max-height: 300px; overflow-y: auto;">${errors.map(error => `• ${error}`).join('<br>')}</div>`,
        icon: 'error',
        confirmButtonText: 'Fix Errors',
        width: '500px'
      });
      return;
    }

    console.log('Form data:', this.regForm.value);
    console.log('Form valid:', this.regForm.valid);
    console.log('Full API URL:', `${this.registerService['API_URL']}/${this.regEndpoint}`);
    
    // If customHandle is true, just emit the form data for step handling
    if (this.options.customHandle) {
      console.log('Emitting for step handling');
      setTimeout(() => {
        this.formElement?.nativeElement?.scrollTo(0, 0);
      }, 100);
      this.regResponse.emit(this.regForm.value);
      this.isSubmitting = false;
      if (event.target) {
        event.target.disabled = false;
      }
      return;
    }
    
    console.log('Proceeding with actual registration');

    event.target.disabled = true;

    this.patchNumberControls();
    this.patchFileControls();

    try {
      console.log(this.extraData);
      const res = await this.registerService.genericRegister(
        this.extraData
          ? { ...this.regForm.value, ...this.extraData }
          : this.regForm.value,
        this.regEndpoint,
        this.hasFile
      );

      this.registerService.clearResponseFromLocal();

      // IMP: This technically implies that login is required, but the backend should ensure this isn't sent unless that is the case
      // If sent for a non-login-required form, the user will be redirected to login, and then back to passes, which is not ideal
      if (res.pass_pending) {
        await Swal.fire({
          title: 'Registration Pending',
          text: `Your registration has been submitted, but will only be confirmed after you purchase the ${res.pass_pending} pass.`,
          icon: 'warning',
          confirmButtonText: `Get ${res.pass_pending} Pass`,
          showCancelButton: false,
          allowOutsideClick: false,
        });
        this.router.navigate(['/pass']);
        return;
      }

      if (res.order) {
        this.registerService.storeResponseToLocal(
          this.regForm,
          this.regEndpoint
        );
        const amountInRupees = (res.order.amount / 100).toFixed(2);
        const proceedConfirmation = await Swal.fire({
          title: 'Proceeding to Payment',
          html: `<p>${
            res.success ??
            'Please wait while we load the payment gateway for you.'
          }</p><p>Amount: ₹${amountInRupees}</p>`,
          icon: 'info',
          timer: this.timerForPrePaymentMessage ? 5_000 : undefined,
          showCancelButton: !this.timerForPrePaymentMessage,
          allowOutsideClick: this.timerForPrePaymentMessage,
        });

        if (
          !this.timerForPrePaymentMessage &&
          !proceedConfirmation.isConfirmed
        ) {
          event.target.disabled = false;
          return;
        }

        const confirmationSwal = await this.paymentsService.warnForPayment('modal');

        event.target.disabled = false;

        if (!confirmationSwal.isConfirmed) return;

        const success = await this.paymentsService.attemptPayment(
          res.order,
          this.paymentEndpoint!,
          this.paymentDescription,
          'modal'
        );

        if (!success) return;
        event.target.disabled = true;
      }

      this.registerService.clearResponseFromLocal();

      this.regForm.reset();
      if (this.customHandle) {
        this.regResponse.emit(res);
      } else {
        window.scrollTo(0, 0);
        await Swal.fire(this.successSwalOptions);
        this.router.navigate([this.returnLink]);
      }
    } catch (e) {
      handleAPIException(e);
    } finally {
      // Always reset the submitting state and button, regardless of success or failure
      this.isSubmitting = false;
      if (event.target) {
        event.target.disabled = false;
      }
    }
  }
}
