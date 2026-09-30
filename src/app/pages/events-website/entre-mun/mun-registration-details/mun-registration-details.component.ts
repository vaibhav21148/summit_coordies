import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import Swal from 'sweetalert2';

interface MUNPreference {
  preference_number: number;
  committee: string;
  country: string;
}

interface MUNRegistration {
  id: number;
  name: string;
  email: string;
  contact: string;
  date_of_birth: string;
  role: string;
  need_accommodation: boolean;
  previous_mun_experience: string;
  referral_source: string;
  is_details_completed: boolean;
}

@Component({
  selector: 'app-mun-registration-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mun-registration-details.component.html',
  styleUrls: ['./mun-registration-details.component.scss']
})
export class MUNRegistrationDetailsComponent implements OnInit {
  registration: MUNRegistration | null = null;
  preferences: MUNPreference[] = [];
  groupInfo: any = null;
  loading = false;
  
  formData = {
    date_of_birth: '',
    role: '',
    need_accommodation: false,
    previous_mun_experience: '',
    referral_source: '',
    preferences: [
      { preference_number: 1, committee: '', country: '' },
      { preference_number: 2, committee: '', country: '' },
      { preference_number: 3, committee: '', country: '' }
    ]
  };

  committees = [
    'United Nations Security Council (UNSC)',
    'United Nations General Assembly (UNGA)',
    'United Nations Human Rights Council (UNHRC)',
    'World Health Organization (WHO)',
    'International Monetary Fund (IMF)',
    'North Atlantic Treaty Organization (NATO)',
    'European Union (EU)',
    'African Union (AU)',
    'Association of Southeast Asian Nations (ASEAN)',
    'Organization of Petroleum Exporting Countries (OPEC)'
  ];

  countries = [
    'United States of America', 'United Kingdom', 'China', 'Russia', 'France',
    'Germany', 'Japan', 'India', 'Brazil', 'Canada', 'Australia', 'South Korea',
    'Italy', 'Spain', 'Mexico', 'Indonesia', 'Turkey', 'Saudi Arabia',
    'Argentina', 'South Africa', 'Egypt', 'Nigeria', 'Pakistan', 'Bangladesh',
    'Vietnam', 'Philippines', 'Thailand', 'Malaysia', 'Singapore', 'Israel'
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRegistrationDetails();
  }

  async loadRegistrationDetails() {
    this.loading = true;
    try {
      const response = await this.http.get<any>(`${environment.apiUrl}/mun/registration/`).toPromise();
      
      if (response.registration) {
        this.registration = response.registration;
        this.preferences = response.preferences || [];
        this.groupInfo = response.group_info;
        
        // Populate form with existing data
        this.formData.date_of_birth = this.registration.date_of_birth || '';
        this.formData.role = this.registration.role || '';
        this.formData.need_accommodation = this.registration.need_accommodation || false;
        this.formData.previous_mun_experience = this.registration.previous_mun_experience || '';
        this.formData.referral_source = this.registration.referral_source || '';
        
        // Populate preferences
        this.formData.preferences = this.preferences.map(pref => ({
          preference_number: pref.preference_number,
          committee: pref.committee,
          country: pref.country
        }));
        
        // Ensure at least 3 preferences
        while (this.formData.preferences.length < 3) {
          this.formData.preferences.push({
            preference_number: this.formData.preferences.length + 1,
            committee: '',
            country: ''
          });
        }
      } else {
        Swal.fire('Error', 'No MUN registration found. Please contact support.', 'error');
        this.router.navigate(['/entremun']);
      }
    } catch (error) {
      console.error('Error loading registration details:', error);
      Swal.fire('Error', 'Failed to load registration details', 'error');
    } finally {
      this.loading = false;
    }
  }

  async saveDetails() {
    // Validate form
    if (!this.formData.date_of_birth || !this.formData.role) {
      Swal.fire('Error', 'Please fill in all required fields', 'error');
      return;
    }

    // Validate preferences (at least 3 required)
    if (this.formData.preferences.length < 3) {
      Swal.fire('Error', 'At least 3 preferences are required', 'error');
      return;
    }
    
    for (let i = 0; i < this.formData.preferences.length; i++) {
      if (!this.formData.preferences[i].committee || !this.formData.preferences[i].country) {
        Swal.fire('Error', `Please complete preference ${i + 1}`, 'error');
        return;
      }
    }

    this.loading = true;
    try {
      const response = await this.http.post<any>(`${environment.apiUrl}/mun/registration/`, this.formData).toPromise();
      
      Swal.fire('Success', response.message, 'success');
      
      // Navigate back to group dashboard if in a group
      if (this.groupInfo) {
        this.router.navigate(['/entremun/dash']);
      } else {
        this.router.navigate(['/entremun']);
      }
    } catch (error: any) {
      Swal.fire('Error', error.error?.message || 'Failed to save details', 'error');
    } finally {
      this.loading = false;
    }
  }

  addPreference() {
    this.formData.preferences.push({
      preference_number: this.formData.preferences.length + 1,
      committee: '',
      country: ''
    });
  }

  removePreference(index: number) {
    if (this.formData.preferences.length > 3) {
      this.formData.preferences.splice(index, 1);
      // Renumber preferences
      this.formData.preferences.forEach((pref, i) => {
        pref.preference_number = i + 1;
      });
    }
  }

  goBack() {
    if (this.groupInfo) {
      this.router.navigate(['/entremun/dash']);
    } else {
      this.router.navigate(['/entremun']);
    }
  }
}