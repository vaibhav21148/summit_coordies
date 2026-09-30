import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';
import { VantaBgComponent } from '../../../../shared/vanta-bg/vanta-bg.component';
import { FooterComponent } from '../../../../components/footer/footer.component';
import { MunGroupPaymentsService } from '../../../../services/mun-group-payments.service';
import { countries } from '../../../../constants/countries';
import { getMunCommittees, munPersonalities } from '../../../../constants/mun';

enum PageStates {
  LOADING = 'LOADING',
  EMPTY = 'EMPTY',
  LEADER = 'LEADER',
  MEMBER = 'MEMBER',
  PAID_INDIVIDUAL = 'PAID_INDIVIDUAL'
}

interface MUNMember {
  id: number;
  profile?: {
    ecell_id: string;
    summit_id: string;
    email: string;
    firstName: string;
    lastName: string;
    summit_pass: string;
    contact: number;
    isadmin: boolean;
  } | null;
  email: string;
  registered: boolean;
  details_completed: boolean;
  registration?: {
    name: string;
    email: string;
    contact: string;
    date_of_birth: string;
    current_institution: string;
    role: string;
    need_accommodation: boolean;
    previous_mun_experience: string;
    referral_source: string;
    is_details_completed: boolean;
    preferences: MUNPreference[];
  } | null;
}

interface MUNGroupData {
  group_id: number;
  member_id: number;
  is_leader: boolean;
  leader: {
    ecell_id: string;
    summit_id: string;
    email: string;
    firstName: string;
    lastName: string;
    summit_pass: string;
    contact: number;
    isadmin: boolean;
  };
  institution_name: string;
  is_paid: boolean;
}

interface MUNMembersData {
  mun_members: MUNMember[];
  is_paid: boolean;
}

interface MUNRegistration {
  name: string;
  email: string;
  contact: string;
  date_of_birth: string;
  current_institution: string;
  role: string;
  need_accommodation: boolean;
  previous_mun_experience: string;
  referral_source: string;
  is_details_completed: boolean;
  preferences: MUNPreference[];
}

interface MUNPreference {
  preference_number: number;
  committee: string;
  country: string;
  personality?: string;
}

interface MUNRegistrationData {
  registration: MUNRegistration | null;
  preferences: MUNPreference[];
  group_info: {
    institution_name: string;
    leader_name: string;
    is_paid: boolean;
  } | null;
  payment_details?: {
    has_paid_registration?: boolean;
    amount_paid?: number;
    payment_id?: string;
    order_id?: string;
    payment_date?: string;
    payment_method?: string;
  };
  has_paid_registration?: boolean;
  amount_paid?: number;
  payment_id?: string;
  order_id?: string;
  payment_date?: string;
  payment_method?: string;
}

@Component({
  selector: 'app-mun-dash',
  standalone: true,
  imports: [CommonModule, FormsModule, VantaBgComponent, FooterComponent],
  templateUrl: './mun-dash.component.html',
  styleUrls: ['./mun-dash.component.scss']
})
export class MunDashComponent implements OnInit {
  pageStates = PageStates;
  pageState = PageStates.LOADING;
  groupData: MUNGroupData | null = null;
  membersData: MUNMembersData | null = null;
  registrationData: MUNRegistrationData | null = null;
  member_email = '';
  loading = false;
  editingMember: MUNMember | null = null;
  editForm: any = {};
  showDropdown: { [key: number]: boolean } = {};
  searchTerms: { [key: number]: string } = {};
  munSettings: any = { allow_post_payment_edits: false };
  canCreateGroup = true;
  munStatus: any = null;
  couponCode = '';
  discountMessage = '';

  constructor(
    private http: HttpClient,
    public router: Router,
    private munGroupPayments: MunGroupPaymentsService
  ) {}

  async ngOnInit() {
    await this.checkMunStatus();
    this.getGroup();
    this.getMunSettings();
  }

  async getGroup() {
    this.pageState = PageStates.LOADING;
    try {
      const response = await this.http.get<MUNGroupData>(`${environment.API_URL}/mun/group/`).toPromise();
      
      if (response && response.group_id) {
        this.groupData = response;
        
        if (response.is_leader) {
          await this.getMembers();
          this.pageState = PageStates.LEADER;
        } else {
          await this.getRegistration();
          this.pageState = PageStates.MEMBER;
        }
      } else {
        // Check if user has paid individual registration
        if (this.munStatus?.has_paid_registration && this.munStatus?.registration_type === 'individual') {
          await this.getRegistration();
          this.pageState = PageStates.PAID_INDIVIDUAL;
        } else {
          this.pageState = PageStates.EMPTY;
        }
      }
    } catch (error: any) {
      console.error('Error loading group:', error);
      if (error.status !== 401) {
        const errorMessage = error.error?.message || 'Failed to load group data';
        Swal.fire('Error', errorMessage, 'error');
      }
      // Check if user has paid individual registration
      if (this.munStatus?.has_paid_registration && this.munStatus?.registration_type === 'individual') {
        await this.getRegistration();
        this.pageState = PageStates.PAID_INDIVIDUAL;
      } else {
        this.pageState = PageStates.EMPTY;
      }
    }
  }

  async getMembers() {
    if (!this.groupData?.is_leader) return;
    
    try {
      const response = await this.http.get<MUNMembersData>(`${environment.API_URL}/mun/group/members/`).toPromise();
      this.membersData = response || null;
    } catch (error) {
      console.error('Error loading members:', error);
      Swal.fire('Error', 'Failed to load group members', 'error');
    }
  }

  async getRegistration() {
    try {
      const response = await this.http.get<MUNRegistrationData>(`${environment.API_URL}/mun/registration/`).toPromise();
      this.registrationData = response || null;
    } catch (error: any) {
      console.error('Error loading registration:', error);
      if (error.status !== 404) {
        const errorMessage = error.error?.message || 'Failed to load registration data';
        Swal.fire('Error', errorMessage, 'error');
      }
    }
  }

  async createGroup() {
    const { value: formValues } = await Swal.fire({
      title: 'Create MUN Group',
      html: `
        <input id="institution" class="swal2-input" placeholder="Institution Name" required>
        <input id="referral" class="swal2-input" placeholder="How did you hear about us? (optional)">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const institution = (document.getElementById('institution') as HTMLInputElement).value.trim();
        const referral = (document.getElementById('referral') as HTMLInputElement).value.trim();
        
        if (!institution) {
          Swal.showValidationMessage('Institution name is required');
          return false;
        }
        
        return {
          institution_name: institution,
          referral_source: referral || ''
        };
      }
    });

    if (formValues) {
      this.loading = true;
      try {
        const response = await this.http.post<any>(`${environment.API_URL}/mun/group/`, formValues).toPromise();
        Swal.fire('Success', response.message || 'Group created successfully', 'success');
        await this.getGroup();
      } catch (error: any) {
        const errorMessage = error.error?.message || error.message || 'Failed to create group';
        Swal.fire('Error', errorMessage, 'error');
      } finally {
        this.loading = false;
      }
    }
  }

  async addMember() {
    if (!this.member_email.trim()) {
      Swal.fire('Error', 'Email is required', 'error');
      return;
    }

    if (!this.isValidEmail(this.member_email)) {
      Swal.fire('Error', 'Please enter a valid email', 'error');
      return;
    }

    this.loading = true;
    try {
      const response = await this.http.post<any>(`${environment.API_URL}/mun/group/members/`, {
        email: this.member_email.trim().toLowerCase()
      }).toPromise();
      
      Swal.fire('Success', response.message, 'success');
      this.member_email = '';
      await this.getMembers();
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Failed to add member';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      this.loading = false;
    }
  }

  async removeMember(memberId: number) {
    const result = await Swal.fire({
      title: 'Remove Member',
      text: 'Are you sure you want to remove this member? Their MUN Registration will also be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    this.loading = true;
    try {
      const response = await this.http.delete<any>(`${environment.API_URL}/mun/group/members/`, {
        body: { member_id: memberId }
      }).toPromise();
      
      Swal.fire('Success', response.message, 'success');
      await this.getMembers();
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Failed to remove member';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      this.loading = false;
    }
  }

  async leaveGroup() {
    const result = await Swal.fire({
      title: 'Leave Group',
      text: 'Are you sure you want to leave this group?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    this.loading = true;
    try {
      const response = await this.http.delete<any>(`${environment.API_URL}/mun/group/members/`).toPromise();
      Swal.fire('Success', response.message, 'success');
      this.router.navigate(['/entremun']);
    } catch (error: any) {
      Swal.fire('Error', error.error?.message || 'Failed to leave group', 'error');
    } finally {
      this.loading = false;
    }
  }

  async deleteGroup() {
    const result = await Swal.fire({
      title: 'Delete Group',
      text: 'Are you sure you want to delete this group? All MUN Registrations will also be deleted. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    this.loading = true;
    try {
      const response = await this.http.delete<any>(`${environment.API_URL}/mun/group/`).toPromise();
      Swal.fire('Success', response.message, 'success');
      this.router.navigate(['/entremun']);
    } catch (error: any) {
      Swal.fire('Error', error.error?.message || 'Failed to delete group', 'error');
    } finally {
      this.loading = false;
    }
  }

  applyCoupon() {
    const code = this.couponCode?.trim();
    if (!code) return;
    
    this.discountMessage = 'Validating...';
    this.discountMessage = `<span style="color: blue;">Code "${code}" will be applied at checkout</span>`;
  }

  async processPayment() {
    const readyCount = this.getReadyMembersCount();
    const unregisteredCount = this.getUnregisteredMembersCount();
    
    if (readyCount === 0) {
      Swal.fire('Error', 'No members have completed MUN Registration details yet', 'error');
      return;
    }
    
    if (unregisteredCount > 0) {
      Swal.fire('Error', `${unregisteredCount} member(s) haven't completed E-Summit Registration yet. All members must register on E-Summit website before MUN payment.`, 'error');
      return;
    }

    this.loading = true;
    try {
      const couponCode = this.couponCode?.trim() || undefined;
      
      // Get actual amount from backend first
      const priceCheck = await this.http.post<any>(`${environment.API_URL}/mun/group/payment/`, {
        coupon_code: couponCode
      }).toPromise();
      
      const actualAmount = priceCheck.final_price || 0;
      const originalAmount = this.getTotalAmount();
      
      // Show discount applied if any
      if (actualAmount < originalAmount && couponCode) {
        const discount = originalAmount - actualAmount;
        this.discountMessage = `<span style="color: green;">Discount applied! Saved ₹${discount/100}</span>`;
      }
      
      const result = await Swal.fire({
        title: 'Confirm Payment',
        text: `You are about to pay for ${readyCount} members. Total: ₹${(actualAmount / 100).toLocaleString()}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Proceed to Payment',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) return;

      const success = await this.munGroupPayments.processMUNGroupPayment(couponCode, 'hosted');
      
      if (success) {
        await this.getGroup();
        await this.getMembers();
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Failed to process payment';
      this.discountMessage = `<span style="color: red;">${errorMessage}</span>`;
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      this.loading = false;
    }
  }



  getReadyMembersCount(): number {
    if (!this.membersData) return 0;
    return this.membersData.mun_members.filter(m => m.registered && m.details_completed).length;
  }

  getUnregisteredMembersCount(): number {
    if (!this.membersData) return 0;
    return this.membersData.mun_members.filter(m => !m.registered).length;
  }

  getTotalAmount(): number {
    const readyCount = this.getReadyMembersCount();
    return readyCount * 220000; // 2200 * 100 (paise)
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  countriesList = Object.keys(countries).map(key => ({
    value: key,
    viewValue: countries[key].name
  }));

  getCommittees() {
    return getMunCommittees(this.editForm.role || 'college');
  }

  getPersonalities() {
    return munPersonalities;
  }

  getAvailableCommittees(currentIndex: number) {
    const allCommittees = this.getCommittees();
    const selectedCommittees = this.editForm.preferences
      .map((p: any, index: number) => index !== currentIndex ? p.committee : null)
      .filter((c: string) => c);
    return allCommittees.filter(committee => !selectedCommittees.includes(committee.value));
  }

  getAvailableCountries(currentIndex: number) {
    const selectedCountries = this.editForm.preferences
      .map((p: any, index: number) => index !== currentIndex ? p.country : null)
      .filter((c: string) => c);
    return this.countriesList.filter(country => !selectedCountries.includes(country.value));
  }

  isAIPPM(committee: string): boolean {
    return committee === 'AIPPM';
  }

  onCommitteeChange(index: number) {
    const preference = this.editForm.preferences[index];
    if (preference.committee === 'AIPPM') {
      preference.country = '';
    } else {
      preference.personality = '';
    }
    this.searchTerms[index] = '';
  }

  onSearchInput(index: number, event: any) {
    const inputValue = event.target.value;
    this.searchTerms[index] = inputValue;
    this.showDropdown[index] = true;
    
    const committee = this.editForm.preferences[index].committee;
    const options = this.isAIPPM(committee) ? this.getPersonalities() : this.getAvailableCountries(index);
    const exactMatch = options.find(option => option.viewValue === inputValue);
    
    if (!exactMatch) {
      if (this.isAIPPM(committee)) {
        this.editForm.preferences[index].personality = '';
      } else {
        this.editForm.preferences[index].country = '';
      }
    } else {
      if (this.isAIPPM(committee)) {
        this.editForm.preferences[index].personality = exactMatch.value;
      } else {
        this.editForm.preferences[index].country = exactMatch.value;
      }
    }
  }

  getFilteredOptions(index: number) {
    const committee = this.editForm.preferences[index].committee;
    const options = this.isAIPPM(committee) ? this.getPersonalities() : this.getAvailableCountries(index);
    const searchTerm = this.searchTerms[index] || '';
    
    if (!searchTerm) {
      return options;
    }
    
    return options.filter(option => 
      option.viewValue.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  selectOption(index: number, option: any) {
    const committee = this.editForm.preferences[index].committee;
    if (this.isAIPPM(committee)) {
      this.editForm.preferences[index].personality = option.value;
    } else {
      this.editForm.preferences[index].country = option.value;
    }
    this.searchTerms[index] = option.viewValue;
    this.showDropdown[index] = false;
  }

  hideDropdown(index: number) {
    setTimeout(() => {
      this.showDropdown[index] = false;
    }, 200);
  }

  editMemberDetails(member: MUNMember) {
    this.editingMember = member;
    this.editForm = {
      name: member.registration?.name || '',
      contact: member.registration?.contact || '',
      date_of_birth: member.registration?.date_of_birth || '',
      role: member.registration?.role || 'college',
      need_accommodation: member.registration?.need_accommodation || false,
      previous_mun_experience: member.registration?.previous_mun_experience || '',
      mun_portfolio: null,
      referral_source: 'Group',
      preferences: member.registration?.preferences || []
    };
    this.ensureCorrectPreferences();
    this.initializeSearchTerms();
  }

  editSelfDetails() {
    this.editingMember = {
      registration: this.registrationData?.registration ? {...this.registrationData.registration, preferences: this.registrationData.preferences} : null,
      profile: null,
      email: this.registrationData?.registration?.email || '',
      registered: true,
      details_completed: true,
      id: 0
    };
    this.editForm = {
      name: this.registrationData?.registration?.name || '',
      contact: this.registrationData?.registration?.contact || '',
      date_of_birth: this.registrationData?.registration?.date_of_birth || '',
      role: this.registrationData?.registration?.role || 'college',
      need_accommodation: this.registrationData?.registration?.need_accommodation || false,
      previous_mun_experience: this.registrationData?.registration?.previous_mun_experience || '',
      referral_source: 'Group',
      preferences: this.registrationData?.preferences || []
    };
    this.ensureCorrectPreferences();
    this.initializeSearchTerms();
  }

  initializeSearchTerms() {
    this.editForm.preferences.forEach((pref: any, index: number) => {
      if (pref.committee === 'AIPPM' && pref.personality) {
        const personality = this.getPersonalities().find(p => p.value === pref.personality);
        this.searchTerms[index] = personality?.viewValue || '';
      } else if (pref.country) {
        const country = this.countriesList.find(c => c.value === pref.country);
        this.searchTerms[index] = country?.viewValue || '';
      } else {
        this.searchTerms[index] = '';
      }
    });
  }

  cancelEdit() {
    this.editingMember = null;
    this.editForm = {};
    this.searchTerms = {};
    this.showDropdown = {};
  }

  async saveMemberDetails() {
    if (!this.editingMember) return;

    // Validate form before submission
    const validationError = this.validateEditForm();
    if (validationError) {
      Swal.fire('Validation Error', validationError, 'error');
      return;
    }

    this.loading = true;
    try {
      const hasFile = this.editForm.mun_portfolio;
      let response;
      
      // Transform preferences for backend
      const transformedPreferences = this.editForm.preferences.map((pref: any) => {
        if (pref.committee === 'AIPPM') {
          return {
            committee: pref.committee,
            country: pref.personality || '',
            personality: ''
          };
        } else {
          return {
            committee: pref.committee,
            country: pref.country || '',
            personality: ''
          };
        }
      });
      
      if (hasFile) {
        // Use FormData if file is present
        const formData = new FormData();
        Object.keys(this.editForm).forEach(key => {
          if (key === 'preferences') {
            formData.append(key, JSON.stringify(transformedPreferences));
          } else if (key === 'mun_portfolio' && this.editForm[key]) {
            formData.append(key, this.editForm[key]);
          } else if (key === 'need_accommodation') {
            formData.append(key, this.editForm[key] ? 'true' : 'false');
          } else if (key !== 'mun_portfolio') {
            formData.append(key, this.editForm[key]);
          }
        });
        
        // Add member_id for identification (0 for self-edit)
        formData.append('member_id', this.editingMember.id.toString());
        
        response = await this.http.put<any>(`${environment.API_URL}/mun/registration/member/`, formData).toPromise();
      } else {
        // Use JSON if no file
        const jsonData = {
          ...this.editForm,
          preferences: transformedPreferences,
          member_id: this.editingMember.id
        };
        delete jsonData.mun_portfolio;
        
        response = await this.http.put<any>(`${environment.API_URL}/mun/registration/member/`, jsonData).toPromise();
      }
      
      Swal.fire('Success', response.message || 'Details updated successfully', 'success');
      this.cancelEdit();
      await this.getMembers();
      if (this.pageState === PageStates.MEMBER) {
        await this.getRegistration();
      }
    } catch (error: any) {
      const errorMessage = error.error?.message || error.message || 'Failed to update details';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      this.loading = false;
    }
  }

  onRoleChange() {
    this.ensureCorrectPreferences();
  }

  ensureCorrectPreferences() {
    const required = this.getRequiredPreferences();
    if (this.editForm.preferences.length < required) {
      while (this.editForm.preferences.length < required) {
        this.editForm.preferences.push({ committee: '', country: '', personality: '' });
      }
    } else if (this.editForm.preferences.length > required) {
      this.editForm.preferences = this.editForm.preferences.slice(0, required);
    }
  }

  getRequiredPreferences(): number {
    return 6;
  }

  isValidPreferences(): boolean {
    const required = this.getRequiredPreferences();
    return this.editForm.preferences.length === required && 
           this.editForm.preferences.every((p: any) => {
             const hasCommittee = p.committee;
             const hasCountryIfNeeded = p.committee === 'AIPPM' || p.country;
             const hasPersonalityIfNeeded = p.committee !== 'AIPPM' || p.personality;
             return hasCommittee && hasCountryIfNeeded && hasPersonalityIfNeeded;
           });
  }

  validateEditForm(): string | null {
    // Check required fields
    if (!this.editForm.name?.trim()) {
      return 'Name is required';
    }
    
    if (!this.editForm.contact?.trim()) {
      return 'Contact number is required';
    }
    
    if (!this.editForm.date_of_birth) {
      return 'Date of birth is required';
    }
    
    if (!this.editForm.role) {
      return 'Role is required';
    }
    
    // Validate contact number format
    const contactRegex = /^[6-9]\d{9}$/;
    if (!contactRegex.test(this.editForm.contact.trim())) {
      return 'Please enter a valid 10-digit mobile number';
    }
    

    
    // Validate preferences
    if (!this.isValidPreferences()) {
      const required = this.getRequiredPreferences();
      return `Please fill all ${required} committee preferences with committee and country/personality as required`;
    }
    
    // Check for duplicate committees
    const committees = this.editForm.preferences.map((p: any) => p.committee).filter((c: string) => c);
    if (new Set(committees).size !== committees.length) {
      return 'Each committee can only be selected once';
    }
    
    // Check for duplicate countries (excluding AIPPM)
    const countries = this.editForm.preferences
      .filter((p: any) => p.committee !== 'AIPPM' && p.country)
      .map((p: any) => p.country);
    if (new Set(countries).size !== countries.length) {
      return 'Each country can only be selected once';
    }
    
    return null;
  }

  isFieldRequired(fieldName: string): boolean {
    return ['name', 'contact', 'date_of_birth', 'role'].includes(fieldName);
  }

  async getMunSettings() {
    try {
      const response = await this.http.get<any>(`${environment.API_URL}/mun/settings/`).toPromise();
      this.munSettings = response;
    } catch (error) {
      console.log('Error loading MUN settings:', error);
    }
  }

  async checkMunStatus() {
    try {
      const response = await this.http.get<any>(`${environment.API_URL}/mun/status/`).toPromise();
      this.munStatus = response;
      this.canCreateGroup = response.can_create_group;
    } catch (error) {
      console.log('Error checking MUN status:', error);
    }
  }

  canEditAfterPayment(): boolean {
    return this.munSettings.allow_post_payment_edits;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire('Invalid File', 'Please upload a PDF, DOC, or DOCX file', 'error');
        event.target.value = '';
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('File Too Large', 'Please upload a file smaller than 5MB', 'error');
        event.target.value = '';
        return;
      }
      
      this.editForm.mun_portfolio = file;
    }
  }
}