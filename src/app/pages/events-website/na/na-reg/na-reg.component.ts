import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { environment } from 'src/environments/environment';
import { AuthService } from '@services/auth.service';
import { PassType } from '@constants/enums/passtype.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-na-reg',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './na-reg.component.html',
  styleUrls: ['./na-reg.component.scss']
})
export class NaRegComponent implements OnInit {
  currentStep = 1;
  selectedRole = '';
  selectedTrack = '';
  formData: any = {};
  isSubmitting = false;
  cofounderVerified: { [key: number]: boolean } = {};
  cofounderVerifying: { [key: number]: boolean } = {};
  
  basicForm!: FormGroup;
  roleForm!: FormGroup;
  specificForm!: FormGroup;
  cofoundersForm!: FormGroup;
  
  roles = [
    { value: 'startup', label: 'Startup' }
  ];
  
  sectors = [
    { value: 'fintech', label: 'FinTech' },
    { value: 'b2b_software_saas', label: 'B2B Software / SaaS' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'consumer_goods_services', label: 'Consumer Goods and Services' },
    { value: 'deep_tech', label: 'Deep Tech' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'web3_blockchain', label: 'Web3 / Blockchain' },
    { value: 'energy_environment', label: 'Energy and Environment' },
    { value: 'sector_agnostic', label: 'Sector Agnostic' },
    { value: 'other', label: 'Other' }
  ];
  

  
  startupStages = [
    { value: 'ideation', label: 'Ideation/Early Stage' },
    { value: 'pre_seed', label: 'Pre-Seed' },
    { value: 'seed', label: 'Seed' },
    { value: 'series_a', label: 'Series A' },
    { value: 'series_b', label: 'Series B' },
    { value: 'series_c', label: 'Series C' },
    { value: 'series_d', label: 'Series D' }
  ];
  
  
  referralSources = [
    { value: 'email', label: 'Email' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'referral', label: 'Referral' },
    { value: 'other', label: 'Other' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {
    this.initializeForms();
  }

  async ngOnInit() {
    // Check if user is authenticated
    if (!this.auth.isLoggedIn()) {
      this.auth.redirectToLogin({ returnUrl: '/na/reg' });
      return;
    }
    
    // Verify login is still valid
    const isValidLogin = await this.auth.checkValidLogin();
    if (!isValidLogin) {
      this.auth.redirectToLogin({ returnUrl: '/na/reg' });
      return;
    }
    
    // Check if already registered
    await this.checkExistingRegistration();
    
    await this.autofillUserData();
  }

  async checkExistingRegistration() {
    try {
      const apiUrl = `${environment.API_URL}/${Endpoint.NA}check/`;
      const response = await this.http.get(apiUrl, { headers: this.auth.headers }).toPromise();
      
      if (response) {
        await Swal.fire({
          title: 'Already Registered',
          text: 'You have already registered for Networking Arena.',
          icon: 'info'
        });
        this.router.navigate(['/na']);
        return;
      }
    } catch (error: any) {
      // If 404 or similar, user is not registered - continue normally
      if (error?.status !== 404) {
        console.error('Error checking registration status:', error);
      }
    }
  }

  async autofillUserData() {
    try {
      // Fetch user info with proper error handling
      const userInfoPromises = [
        this.auth.getUserInfo('firstName', true).catch(() => null),
        this.auth.getUserInfo('lastName', true).catch(() => null),
        this.auth.getUserInfo('email', true).catch(() => null),
        this.auth.getUserInfo('contact', true).catch(() => null)
      ];
      
      await Promise.allSettled(userInfoPromises);
      
      const firstName = this.auth.getStoredUserInfo('firstName');
      const lastName = this.auth.getStoredUserInfo('lastName');
      const email = this.auth.getStoredUserInfo('email');
      const contact = this.auth.getStoredUserInfo('contact');

      const fullName = `${firstName || ''} ${lastName || ''}`.trim();
      
      this.basicForm.patchValue({
        full_name: fullName || '',
        email: email || '',
        contact_number: contact || ''
      });
      
    } catch (error) {
      console.error('Error during user data autofill:', error);
    }
  }
  
  initializeForms() {
    this.basicForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      linkedin: [''],
      bio: [''],
      referral_source: [''],
      role: ['', Validators.required]
    });
    
    this.roleForm = this.fb.group({
      role: ['', Validators.required]
    });
    
    this.specificForm = this.fb.group({
      // Startup fields
      startup_name: [''],
      website: [''],
      active_years: ['', [Validators.pattern('^[0-9]+$')]],
      sector: [''],
      other_sector: [''],
      stage_of_startup: [''],
      pitch_deck: [null]
    });
    
    this.cofoundersForm = this.fb.group({
      cofounders: this.fb.array([])
    });
  }
  
  onRoleChange() {
    this.selectedRole = this.basicForm.get('role')?.value || '';
    
    // Check if startup role is selected and user doesn't have platinum pass
    if (this.selectedRole === 'startup') {
      const hasPlatinum = this.auth.checkCurrentPass('eq', PassType.STUDENT) || 
                         this.auth.checkCurrentPass('gt', PassType.STUDENT);
      
      if (!hasPlatinum) {
        Swal.fire({
          icon: 'warning',
          title: 'Gold Pass Required',
          text: 'You need a Gold pass or higher to register as a startup for Networking Arena.',
          confirmButtonText: 'Get Pass',
          showCancelButton: true,
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/pass']);
          } else {
            // Reset the role selection
            this.basicForm.patchValue({ role: '' });
            this.selectedRole = '';
          }
        });
        return;
      }
    }
    
    this.updateFormValidation();
  }
  
  updateFormValidation() {
    // Clear all validators first
    Object.keys(this.specificForm.controls).forEach(key => {
      this.specificForm.get(key)?.clearValidators();
      this.specificForm.get(key)?.updateValueAndValidity();
    });
    
    // Add role-specific validators
    if (this.selectedRole === 'startup') {
      this.specificForm.get('startup_name')?.setValidators([Validators.required]);
      this.specificForm.get('sector')?.setValidators([Validators.required]);
      this.specificForm.get('stage_of_startup')?.setValidators([Validators.required]);
      this.specificForm.get('pitch_deck')?.setValidators([Validators.required]);
    }
    
    // Update validity
    Object.keys(this.specificForm.controls).forEach(key => {
      this.specificForm.get(key)?.updateValueAndValidity();
    });
  }
  
  get cofounders() {
    return this.cofoundersForm.get('cofounders') as FormArray;
  }
  
  addCofounder() {
    const cofounderGroup = this.fb.group({
      summit_id: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
    this.cofounders.push(cofounderGroup);
  }
  
  removeCofounder(index: number) {
    this.cofounders.removeAt(index);
    delete this.cofounderVerified[index];
    delete this.cofounderVerifying[index];
    // Re-index verification status
    const newVerified: { [key: number]: boolean } = {};
    const newVerifying: { [key: number]: boolean } = {};
    Object.keys(this.cofounderVerified).forEach(k => {
      const key = parseInt(k);
      if (key > index) {
        newVerified[key - 1] = this.cofounderVerified[key];
      } else {
        newVerified[key] = this.cofounderVerified[key];
      }
    });
    Object.keys(this.cofounderVerifying).forEach(k => {
      const key = parseInt(k);
      if (key > index) {
        newVerifying[key - 1] = this.cofounderVerifying[key];
      } else {
        newVerifying[key] = this.cofounderVerifying[key];
      }
    });
    this.cofounderVerified = newVerified;
    this.cofounderVerifying = newVerifying;
  }

  verifyCofounder(index: number) {
    const cofounderGroup = this.cofounders.at(index) as FormGroup;
    const summitId = cofounderGroup.get('summit_id')?.value?.trim();
    const email = cofounderGroup.get('email')?.value?.trim();

    if (!summitId || !email) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please enter both E-Summit ID and Email before verifying.'
      });
      return;
    }

    this.cofounderVerifying[index] = true;
    this.cofounderVerified[index] = false;

    const apiUrl = `${environment.API_URL}/${Endpoint.NA_VERIFY_COFOUNDER}`;

    this.http.post(apiUrl, { summit_id: summitId, email: email }, { headers: this.auth.headers }).subscribe({
      next: (response: any) => {
        this.cofounderVerifying[index] = false;
        if (response.valid) {
          this.cofounderVerified[index] = true;
          // Auto-fill name and contact from verified profile
          cofounderGroup.patchValue({
            name: response.name || '',
            contact: response.contact || ''
          });
          Swal.fire({
            icon: 'success',
            title: 'Verified!',
            text: `${response.name} has a Gold Pass and can be added as a co-founder.`,
            timer: 2500,
            showConfirmButton: false
          });
        } else {
          this.cofounderVerified[index] = false;
          Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: response.error || 'Could not verify this co-founder.'
          });
        }
      },
      error: (err) => {
        this.cofounderVerifying[index] = false;
        this.cofounderVerified[index] = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.error || 'An error occurred while verifying. Please try again.'
        });
      }
    });
  }
  
  nextStep() {
    if (this.currentStep === 1) {
      this.onRoleChange(); // Ensure role is set and validation is updated
    }
    this.currentStep++;
  }
  
  previousStep() {
    this.currentStep--;
  }
  
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.specificForm.patchValue({ pitch_deck: file });
      this.specificForm.get('pitch_deck')?.markAsTouched();
    } else if (file) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select a PDF file only.'
      });
      event.target.value = '';
      this.specificForm.patchValue({ pitch_deck: null });
      this.specificForm.get('pitch_deck')?.markAsTouched();
    }
  }
  
  submitForm() {
    if (!this.specificForm.valid || this.isSubmitting) {
      console.log('Form is invalid or already submitting');
      return;
    }

    // Check all cofounders are verified
    for (let i = 0; i < this.cofounders.length; i++) {
      if (!this.cofounderVerified[i]) {
        Swal.fire({
          icon: 'warning',
          title: 'Unverified Co-founder',
          text: `Please verify Co-founder ${i + 1} before submitting.`
        });
        return;
      }
    }

    this.isSubmitting = true;
    const formData = new FormData();
    
    const allData = {
      ...this.basicForm.value,
      ...this.specificForm.value,
      cofounders: this.cofoundersForm.value.cofounders || []
    };
    
    console.log('Submitting data:', allData);
    
    Object.keys(allData).forEach(key => {
      if (allData[key] !== null && allData[key] !== '' && allData[key] !== false) {
        if (key === 'pitch_deck' && allData[key] instanceof File) {
          formData.append(key, allData[key]);
        } else if (key === 'cofounders') {
          formData.append(key, JSON.stringify(allData[key]));
        } else if (key !== 'pitch_deck') {
          formData.append(key, allData[key]);
        }
      }
    });
    
    const apiUrl = `${environment.API_URL}/${Endpoint.NA}`;
    console.log('Submitting to:', apiUrl);
    
    this.http.post(apiUrl, formData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Thank you for registering. You will receive a confirmation email shortly.',
          timer: 3000
        }).then(() => {
          this.router.navigate(['/events']);
        });
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.isSubmitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error?.error?.message || 'Registration failed. Please try again.'
        });
      }
    });
  }
  
  returnHome() {
    this.router.navigate(['/na']);
  }
}
