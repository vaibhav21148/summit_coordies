import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkshopService, Workshop, WorkshopRegistrationRequest } from '@services/workshop.service';
import { WorkshopPaymentService } from '@services/workshop-payment.service';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { environment } from 'src/environments/environment';

declare var Razorpay: any;

@Component({
  selector: 'app-workshop-reg',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './workshop-reg.component.html',
  styleUrl: './workshop-reg.component.scss'
})
export class WorkshopRegComponent implements OnInit {
  workshopForm!: FormGroup;
  isSubmitting = false;
  workshops: Workshop[] = [];
  userRegistrations: { [key: string]: boolean } = {};
  isLoading = true;
  private _workshopOptions: any[] = [];
  
  get workshopOptions() {
    if (this._workshopOptions.length === 0 && this.workshops.length > 0) {
      this._workshopOptions = this.workshops
        .filter(workshop => !this.userRegistrations[workshop.workshop_name])
        .map(workshop => ({
          value: workshop.workshop_name,
          viewValue: workshop.workshop_name,
          price: workshop.price,
          description: workshop.description,
          islive: workshop.islive,
          tag: workshop.tag || ''
        }));
    }
    return this._workshopOptions;
  }

  constructor(
    private fb: FormBuilder,
    private workshopService: WorkshopService,
    private workshopPaymentService: WorkshopPaymentService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  async ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.authService.redirectToLogin({ returnUrl: '/workshops/reg' });
      return;
    }

    try {
      console.log('Initializing workshop registration component');
      await this.loadWorkshops();
      await this.autofillUserData();
      console.log('Workshop registration component initialized successfully');
    } catch (error) {
      console.error('Error during component initialization:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Swal.fire({
        title: 'Error',
        text: `Failed to load workshops: ${errorMessage}. Please try again.`,
        icon: 'error'
      });
    } finally {
      this.isLoading = false;
    }
  }

  initForm() {
    this.workshopForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      workshop: ['', Validators.required],
      coupon_code: [''],
    });
  }



  async loadWorkshops() {
    try {
      console.log('Loading workshops from service');
      const response = await this.workshopService.getWorkshops();
      this.workshops = response.workshops.filter(w => w.islive);
      this.userRegistrations = response.user_registrations;
      this._workshopOptions = []; // Reset cached options
      console.log(`Loaded ${this.workshops.length} active workshops`);
      
      // Check if all workshops are already registered
      const availableWorkshops = this.workshops.filter(w => !this.userRegistrations[w.workshop_name]);
      if (availableWorkshops.length === 0 && this.workshops.length > 0) {
        console.log('All workshops are already registered, redirecting');
        await Swal.fire({
          title: 'All Workshops Registered',
          text: 'You have already registered for all available workshops.',
          icon: 'info'
        });
        this.router.navigate(['/workshops']);
        return;
      }
      

    } catch (error) {
      console.error('Failed to load workshops:', error);
      throw new Error('Unable to fetch workshop data');
    }
  }



  async autofillUserData() {
    try {
      console.log('Starting user data autofill process');
      
      // Check existing stored data
      const existingData = {
        firstName: this.authService.getStoredUserInfo('firstName'),
        lastName: this.authService.getStoredUserInfo('lastName'),
        email: this.authService.getStoredUserInfo('email'),
        contact: this.authService.getStoredUserInfo('contact')
      };
      console.log('Existing stored data:', existingData);
      
      // Fetch user info with proper error handling
      console.log('Fetching user info from server');
      const userInfoPromises = [
        this.authService.getUserInfo('firstName', true).catch(err => {
          console.warn('Failed to fetch firstName:', err);
          return null;
        }),
        this.authService.getUserInfo('lastName', true).catch(err => {
          console.warn('Failed to fetch lastName:', err);
          return null;
        }),
        this.authService.getUserInfo('email', true).catch(err => {
          console.warn('Failed to fetch email:', err);
          return null;
        }),
        this.authService.getUserInfo('contact', true).catch(err => {
          console.warn('Failed to fetch contact:', err);
          return null;
        })
      ];
      
      await Promise.allSettled(userInfoPromises);
      console.log('User info fetch completed');
      
      const firstName = this.authService.getStoredUserInfo('firstName');
      const lastName = this.authService.getStoredUserInfo('lastName');
      const email = this.authService.getStoredUserInfo('email');
      const contact = this.authService.getStoredUserInfo('contact');

      const fullName = `${firstName || ''} ${lastName || ''}`.trim();
      
      const formData = {
        name: fullName || '',
        email: email || '',
        contact: contact || ''
      };
      
      console.log('Updating form with user data:', formData);
      this.workshopForm.patchValue(formData);
      
    } catch (error) {
      console.error('Critical error during user data autofill:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`User data autofill failed: ${errorMessage}`);
    }
  }



  async onSubmit() {
    if (!this.workshopForm.valid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    try {
      const formData = this.workshopForm.value;
      
      const submitData: WorkshopRegistrationRequest = {
        workshops: [formData.workshop],
      };

      if (formData.coupon_code) {
        submitData.coupon_code = formData.coupon_code;
      }

      const response = await this.workshopService.registerForWorkshops(submitData);

      if (response.order) {
        // Payment required
        const userEmail = this.authService.getStoredUserInfo('email');
        const userContact = this.authService.getStoredUserInfo('contact');
        await this.workshopPaymentService.processPayment(response.order, userEmail, userContact);
      } else {
        // Free registration
        await Swal.fire({
          title: 'Registration Successful!',
          text: response.success,
          icon: 'success',
          timer: 4000
        });
        this.router.navigate(['/workshops']);
      }
    } catch (error) {
      console.error('Workshop registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : 
                          typeof error === 'string' ? error : 
                          'Registration failed. Please try again.';
      
      await Swal.fire({
        title: 'Registration Error',
        text: errorMessage,
        icon: 'error'
      });
    } finally {
      this.isSubmitting = false;
    }
  }


}