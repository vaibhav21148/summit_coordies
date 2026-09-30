import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { RegisterService } from '@services/register.service';
import { MunPaymentService } from '@services/mun-payment.service';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { countries } from '@constants/countries';
import { getMunCommittees, munRoles, munPersonalities } from '@constants/mun';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-mun-reg',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DialogModule],
  templateUrl: './mun-reg.component.html',
  styleUrl: './mun-reg.component.scss'
})
export class MUNRegComponent implements OnInit {
  basicForm!: FormGroup;
  preferencesForm!: FormGroup;
  additionalForm!: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  selectedRole = '';
  isSubmitting = false;
  showKonfhubWidget = false;
  
  // MUN Committee Options
  committees = getMunCommittees('college'); // Default to college

  // MUN Country Options - using countries enum
  countries = Object.keys(countries).map(key => ({
    value: key,
    viewValue: countries[key].name
  }));

  // MUN Personality Options
  personalities = munPersonalities;

  // Role Options
  roles = munRoles;

  // Search functionality
  showDropdown: { [key: number]: boolean } = {};
  searchTerms: { [key: number]: string } = {};

  // Blocked preferences for preference 1
  blockedPreferences1: { committee: string, country: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private munPaymentService: MunPaymentService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.authService.redirectToLogin({ returnUrl: '/entremun/reg' });
      return;
    }
    
        
    this.initForms();

    // Check MUN status using new endpoint
    try {
      const statusResponse = await this.http.get<any>(`${environment.API_URL}/mun/status/`, {
        headers: this.authService.headers
      }).toPromise();
      
      if (statusResponse.has_paid_registration) {
        await Swal.fire({
          title: 'Already Registered',
          text: 'You already have a paid MUN registration.',
          icon: 'info'
        });
        this.router.navigate(['/entremun']);
        return;
      }
      
      if (!statusResponse.can_register_individual) {
        await Swal.fire({
          title: 'Registration Not Available',
          text: 'Individual registration is not available for your account.',
          icon: 'warning'
        });
        this.router.navigate(['/entremun']);
        return;
      }
    } catch (error) {
      console.log('Error checking MUN status:', error);
    }
    
    // Fetch blocked preferences for preference 1
    try {
      const blockedResponse = await this.http.get<any>(`${environment.API_URL}/${Endpoint.MUN_BLOCKED_PREFERENCES}`, {
        headers: this.authService.headers
      }).toPromise();
      this.blockedPreferences1 = blockedResponse || [];
    } catch (error) {
      console.log('Error fetching blocked preferences:', error);
    }

    await this.autofillUserData();
    await this.loadSavedData();
    this.setupAutoSave();

  }
  
  initForms() {
    this.basicForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      date_of_birth: ['', Validators.required],
      current_institution: ['', Validators.required],
      role: ['', Validators.required]
    });
    
    this.preferencesForm = this.fb.group({
      committee_1: ['', Validators.required],
      country_1: ['', Validators.required],
      committee_2: ['', Validators.required],
      country_2: ['', Validators.required],
      committee_3: ['', Validators.required],
      country_3: ['', Validators.required],
      committee_4: ['', Validators.required],
      country_4: ['', Validators.required],
      committee_5: ['', Validators.required],
      country_5: ['', Validators.required],
      committee_6: ['', Validators.required],
      country_6: ['', Validators.required]
    });
    
    // Update validators based on role selection
    this.basicForm.get('role')?.valueChanges.subscribe(role => {
      this.selectedRole = role;
      this.committees = getMunCommittees(role);
      for (let i = 1; i <= 6; i++) {
        this.preferencesForm.get(`committee_${i}`)?.setValidators([Validators.required]);
        this.preferencesForm.get(`country_${i}`)?.setValidators([Validators.required]);
        this.preferencesForm.get(`committee_${i}`)?.updateValueAndValidity();
        this.preferencesForm.get(`country_${i}`)?.updateValueAndValidity();
      }
    });
    
    // Add validation for duplicate selections
    this.preferencesForm.valueChanges.subscribe(() => {
      this.validateDuplicates();
    });
    
    this.additionalForm = this.fb.group({
      previous_mun_experience: [''],
      mun_portfolio: [null],
      need_accommodation: [false],
      referral_source: ['', Validators.required],
      coupon_code: ['']
    });
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
      this.basicForm.patchValue(formData);
      
    } catch (error) {
      console.error('Critical error during user data autofill:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`User data autofill failed: ${errorMessage}`);
    }
  }


  
  loadSavedData() {
    const savedData = localStorage.getItem('mun-form-data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.basicForm.patchValue(data.basic || {});
        this.preferencesForm.patchValue(data.preferences || {});
        this.additionalForm.patchValue(data.additional || {});
        this.selectedRole = data.basic?.role || '';
        
        // Initialize search terms with display values
        for (let i = 1; i <= 6; i++) {
          const countryValue = this.preferencesForm.get(`country_${i}`)?.value;
          if (countryValue) {
            const committee = this.preferencesForm.get(`committee_${i}`)?.value;
            if (committee === 'IPC' && countryValue === 'NA') {
              this.searchTerms[i] = 'NA';
              continue;
            }
            const options = this.isAIPPM(committee) ? this.personalities : this.countries;
            const option = options.find(opt => opt.value === countryValue);
            if (option) {
              this.searchTerms[i] = option.viewValue;
            }
          }
        }
      } catch (error) {
        console.log('Error loading saved form data');
      }
    }
  }
  
  saveFormData() {
    const formData = {
      basic: this.basicForm.value,
      preferences: this.preferencesForm.value,
      additional: { ...this.additionalForm.value, mun_portfolio: null }
    };
    localStorage.setItem('mun-form-data', JSON.stringify(formData));
  }
  
  setupAutoSave() {
    this.basicForm.valueChanges.subscribe(() => this.saveFormData());
    this.preferencesForm.valueChanges.subscribe(() => this.saveFormData());
    this.additionalForm.valueChanges.subscribe(() => this.saveFormData());
  }
  
  onRoleChange() {
    this.selectedRole = this.basicForm.get('role')?.value;
    // Update committees based on role
    this.committees = getMunCommittees(this.selectedRole);
  }

  isAIPPM(committee: string): boolean {
    return committee === 'AIPPM';
  }

  onCommitteeChange(preferenceNumber: number) {
    const committee = this.preferencesForm.get(`committee_${preferenceNumber}`)?.value;
    if (committee === 'IPC') {
      this.preferencesForm.get(`country_${preferenceNumber}`)?.setValue('NA');
      this.searchTerms[preferenceNumber] = 'NA';
    } else {
      this.preferencesForm.get(`country_${preferenceNumber}`)?.setValue('');
      this.searchTerms[preferenceNumber] = '';
    }
  }

  onSearchInput(preferenceNumber: number, event: any) {
    const inputValue = event.target.value;
    this.searchTerms[preferenceNumber] = inputValue;
    this.showDropdown[preferenceNumber] = true;
    
    // Clear form control value if input doesn't match any option exactly
    const committee = this.preferencesForm.get(`committee_${preferenceNumber}`)?.value;
    const options = this.isAIPPM(committee) ? this.personalities : this.countries;
    const exactMatch = options.find(option => option.viewValue === inputValue);
    
    if (!exactMatch) {
      this.preferencesForm.get(`country_${preferenceNumber}`)?.setValue('');
    } else {
      this.preferencesForm.get(`country_${preferenceNumber}`)?.setValue(exactMatch.value);
    }
  }

  getFilteredOptions(preferenceNumber: number) {
    const committee = this.preferencesForm.get(`committee_${preferenceNumber}`)?.value;
    const options = this.isAIPPM(committee) ? this.personalities : this.countries;
    const searchTerm = this.searchTerms[preferenceNumber] || '';
    
    let filteredOptions = options;

    if (preferenceNumber === 1 && committee) {
      // Find all blocked countries for this committee
      const blockedCountries = this.blockedPreferences1
        .filter(bp => bp.committee === committee)
        .map(bp => bp.country);
        
      filteredOptions = filteredOptions.filter(option => !blockedCountries.includes(option.value));
    }
    
    if (!searchTerm) {
      return filteredOptions;
    }
    
    return filteredOptions.filter(option => 
      option.viewValue.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  selectOption(preferenceNumber: number, option: any) {
    this.preferencesForm.get(`country_${preferenceNumber}`)?.setValue(option.value);
    this.searchTerms[preferenceNumber] = option.viewValue;
    this.showDropdown[preferenceNumber] = false;
  }

  hideDropdown(preferenceNumber: number) {
    setTimeout(() => {
      this.showDropdown[preferenceNumber] = false;
    }, 200);
  }
  
  async nextStep() {
    if (this.currentStep === 1) {
      this.onRoleChange();
    }
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }
  
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  isStep1Valid() {
    return this.basicForm.valid;
  }
  
  validateDuplicates() {
    const combinations: string[] = [];
    
    for (let i = 1; i <= 6; i++) {
      const committee = this.preferencesForm.get(`committee_${i}`)?.value;
      const country = this.preferencesForm.get(`country_${i}`)?.value;
      
      if (committee && country) {
        const combination = `${committee}-${country}`;
        
        if (combinations.includes(combination)) {
          this.preferencesForm.get(`committee_${i}`)?.setErrors({ duplicate: true });
          this.preferencesForm.get(`country_${i}`)?.setErrors({ duplicate: true });
        } else {
          combinations.push(combination);
          
          // Clear duplicate errors if combination is unique
          const committeeErrors = this.preferencesForm.get(`committee_${i}`)?.errors;
          if (committeeErrors?.['duplicate']) {
            delete committeeErrors['duplicate'];
            this.preferencesForm.get(`committee_${i}`)?.setErrors(Object.keys(committeeErrors).length ? committeeErrors : null);
          }
          
          const countryErrors = this.preferencesForm.get(`country_${i}`)?.errors;
          if (countryErrors?.['duplicate']) {
            delete countryErrors['duplicate'];
            this.preferencesForm.get(`country_${i}`)?.setErrors(Object.keys(countryErrors).length ? countryErrors : null);
          }
        }
      }
    }
  }
  
  isStep2Valid() {
    const requiredFields = [
      'committee_1', 'country_1', 'committee_2', 'country_2',
      'committee_3', 'country_3', 'committee_4', 'country_4',
      'committee_5', 'country_5', 'committee_6', 'country_6'
    ];
    
    return requiredFields.every(field => this.preferencesForm.get(field)?.valid) && !this.hasDuplicates();
  }
  
  hasDuplicates() {
    for (let i = 1; i <= 6; i++) {
      const committeeControl = this.preferencesForm.get(`committee_${i}`);
      const countryControl = this.preferencesForm.get(`country_${i}`);
      if (committeeControl?.errors?.['duplicate'] || countryControl?.errors?.['duplicate']) {
        return true;
      }
    }
    return false;
  }
  
  hasError(fieldName: string, errorType: string) {
    return this.preferencesForm.get(fieldName)?.errors?.[errorType];
  }
  
  getAvailableCommittees(currentIndex: number) {
    return this.committees;
  }
  
  getAvailableCountries(currentIndex: number) {
    return this.countries;
  }
  
  getPreferencesCount() {
    let count = 0;
    for (let i = 1; i <= 6; i++) {
      const committee = this.preferencesForm.get(`committee_${i}`)?.value;
      const country = this.preferencesForm.get(`country_${i}`)?.value;
      if (committee && country) count++;
    }
    return count;
  }
  
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.additionalForm.patchValue({ mun_portfolio: file });
    } else if (file) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select a PDF file only.'
      });
      event.target.value = '';
    }
  }
  
  async onSubmit() {
    if (!this.additionalForm.valid || this.isSubmitting) {
      return;
    }

    // Check for duplicate combinations before submission
    if (this.hasDuplicates()) {
      await Swal.fire({
        title: 'Duplicate Preferences',
        text: 'Please remove duplicate committee-country combinations before submitting.',
        icon: 'error'
      });
      return;
    }

    this.isSubmitting = true;
    try {
      // Transform preferences to expected backend format
      const preferences = [];
      const combinations: string[] = [];
      
      for (let i = 1; i <= 6; i++) {
        const committee = this.preferencesForm.get(`committee_${i}`)?.value;
        const country = this.preferencesForm.get(`country_${i}`)?.value;
        if (committee && country) {
          const combination = `${committee}-${country}`;
          if (combinations.includes(combination)) {
            await Swal.fire({
              title: 'Duplicate Preferences',
              text: 'You have selected the same committee-country combination multiple times. Please choose different combinations.',
              icon: 'error'
            });
            this.isSubmitting = false;
            return;
          }
          combinations.push(combination);
          preferences.push({ committee, country });
        }
      }
      
      // Validate preferences count (6 required)
      const minRequired = 6;
      if (preferences.length < minRequired) {
        await Swal.fire({
          title: 'Incomplete Preferences',
          text: `Please provide all 6 committee/country preferences.`,
          icon: 'warning'
        });
        this.isSubmitting = false;
        return;
      }
      
      // Transform preferences to backend format
      const preferencesData: any = {};
      preferences.forEach((pref, index) => {
        const num = index + 1;
        preferencesData[`committee_${num}`] = pref.committee;
        preferencesData[`country_${num}`] = pref.country;
      });
      
      // Add coupon code if provided
      const couponCode = this.additionalForm.get('coupon_code')?.value;
      
      const formData = {
        ...this.basicForm.value,
        ...preferencesData,
        previous_mun_experience: this.additionalForm.get('previous_mun_experience')?.value || '',
        need_accommodation: this.additionalForm.get('need_accommodation')?.value || false,
        referral_source: this.additionalForm.get('referral_source')?.value || '',
        mun_portfolio: this.additionalForm.get('mun_portfolio')?.value,
        user: 'auto' // Backend will auto-assign the user's summit profile
      };
      
      if (couponCode) {
        formData.coupon_code = couponCode;
      }
      
      console.log('Form data being sent:', formData);
      
      // Get CSRF token first
      try {
        await this.registerService.hasRegistered(Endpoint.MUN);
      } catch (e) {
        // This call will set the CSRF cookie even if it fails
      }
      
      const result = await this.registerService.genericRegister(
        formData,
        Endpoint.MUN,
        true
      );
      
      console.log('MUN Registration Result:', result);
      localStorage.removeItem('mun-form-data');
      this.isSubmitting = false;
      this.showKonfhubWidget = true;
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Check if it's a 403 error (not registered for summit)
      if ((error as any)?.status === 403) {
        const result = await Swal.fire({
          title: 'Summit Registration Required',
          text: 'You need to complete your E-Summit registration first before registering for MUN.',
          icon: 'warning',
          showConfirmButton: true,
          confirmButtonText: 'Register for Summit',
          showCancelButton: true,
          cancelButtonText: 'Cancel'
        });
        
        if (result.isConfirmed) {
          this.router.navigate(['/register']);
        }
        this.isSubmitting = false;
        return;
      }
      
      // The error from registerService.genericRegister is already processed by getErrorMessage
      // So it should be a string containing the actual error message
      let errorMessage = typeof error === 'string' ? error : 'Please try again.';
      
      await Swal.fire({
        title: 'Registration Failed',
        text: errorMessage,
        icon: 'error'
      });
      this.isSubmitting = false;
    }
  }

  onCloseKonfhubWidget() {
    this.showKonfhubWidget = false;
    this.router.navigate(['/entremun']);
  }
}
