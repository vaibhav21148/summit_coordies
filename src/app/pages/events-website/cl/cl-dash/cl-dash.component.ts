import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { AuthService } from 'src/app/services/auth.service';
import { ContingentPaymentsService } from 'src/app/services/contingent-payments.service';
import { getErrorMessage, handleAPIException } from 'src/app/utils/error';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NewPassType } from '@constants/enums/passtype.enum';
import { ContactComponent } from '@shared/contact/contact.component';
import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";

enum PageStates {
  LOADING,
  EMPTY,
  LEADER,
  MEMBER,
}

@Component({
  selector: 'app-cl-dash',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    FormsModule,
    CommonModule,
    ContactComponent,
    VantaBgComponent
],
  templateUrl: './cl-dash.component.html',
  styleUrl: './cl-dash.component.scss',
})
export class ClDashComponent {
  pageStates = PageStates;
  pageState = PageStates.LOADING;
  passType = NewPassType;

  contingent_id: number | null = null;
  member_id: number | null = null;
  member_email: string | null = null;
  clleader: any;
  members: any[] = [];
  couponCode = '';
  pricingData: any = null;
  contingentMembers: any[] = [];
  memberUpgrades: { [key: string]: string } = {};
  isLoadingPrice = false;

  constructor(
    private auth: AuthService, 
    private http: HttpClient,
    private contingentPayments: ContingentPaymentsService
  ) {}

  get totalMembers(): number {
    return this.members.filter(m => m.registered).length + 1; // +1 for leader
  }

  get eligibleMembers(): number {
    if (!this.pricingData?.breakdown) return 0;
    return this.pricingData.breakdown.filter((member: any) => 
      member.current_pass === this.passType.NONE || member.current_pass === this.passType.SILVER
    ).length;
  }

  get discountPercentage(): number {
    return this.pricingData?.discount_percent || 0;
  }

  get subtotalPrice(): number {
    return (this.pricingData?.amount_before_auto_discount || 0) / 100;
  }

  get discountAmount(): number {
    return ((this.pricingData?.amount_before_auto_discount || 0) - (this.pricingData?.final_amount || 0)) / 100;
  }

  get totalPrice(): number {
    return (this.pricingData?.final_amount || 0) / 100;
  }

  get hasAnyPayments(): boolean {
    return this.pricingData?.breakdown?.some((member: any) => member.bought_by_contingent) || false;
  }

  canDeleteMember(member: any): boolean {
    return !member.is_leader && !member.bought_by_contingent;
  }

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.auth.redirectToLogin({
        returnUrl: '/cl/dash',
      });
      return;
    }

    this.getContingent();
  }

  leaderInfo: any = null;

  async getContingent() {
    this.pageState = PageStates.LOADING;
    try {
      const contingentResponse = await this.http.get(
        `${environment.API_URL}/${Endpoint.CONTINGENT}`,
        { headers: this.auth.headers }
      ).toPromise() as any;
      
      if (!contingentResponse.contingent_id) {
        this.pageState = PageStates.EMPTY;
        return;
      }
      
      this.pageState = contingentResponse.is_leader 
        ? PageStates.LEADER 
        : PageStates.MEMBER;
      
      if (this.pageState === PageStates.LEADER) {
        await this.loadContingentMembers();
      } else {
        this.leaderInfo = contingentResponse.leader;
      }
    } catch (error) {
      console.error('Error loading contingent:', error);
      this.pageState = PageStates.EMPTY;
    }
  }

  async makeContingent() {
    const confirm = await Swal.fire({
      title: 'Become Contingent Leader',
      text: 'Are you sure you want to become a contingent leader?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Create Contingent',
      cancelButtonText: 'Cancel'
    });

    if (!confirm.isConfirmed) {
      return;
    }

    this.pageState = PageStates.LOADING;
    
    try {
      const response = await this.contingentPayments.createContingent();
      Swal.fire({
        title: 'Success!',
        text: 'You are now a contingent leader.',
        icon: 'success'
      });
      this.getContingent();
    } catch (error) {
      this.pageState = PageStates.EMPTY;
      console.error('Error creating contingent:', error);
    }
  }

  async leaveContingent() {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are trying to leave the contingent.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });

    if (!confirm.isConfirmed) {
      return;
    }

    this.pageState = PageStates.LOADING;
    
    try {
      const response = await this.contingentPayments.leaveContingent();
      Swal.fire('Success', response.message || 'Successfully left the contingent', 'success');
      this.contingent_id = null;
      this.clleader = null;
      this.pageState = PageStates.EMPTY;
    } catch (error) {
      this.pageState = PageStates.MEMBER;
      console.error('Error leaving contingent:', error);
    }
  }

  async loadContingentMembers() {
    try {
      const response = await this.contingentPayments.getContingentMembers();
      this.contingentMembers = response.members;
      
      this.memberUpgrades = {};
      response.members.forEach(member => {
        if (member.current_pass !== this.passType.SIGNATURE) {
          this.memberUpgrades[member.member_id] = member.default_upgrade || (member.current_pass === 'none' ? 'lvl2' : 'no_upgrade');
        }
      });
      
      await this.updatePricing();
    } catch (error) {
      console.error('Error loading contingent members:', error);
    }
  }

  async updatePricing() {
    if (Object.keys(this.memberUpgrades).length === 0) return;
    
    this.isLoadingPrice = true;
    try {
      const pricingRequest = {
        member_upgrades: this.memberUpgrades,
        coupon_code: this.couponCode?.trim() || undefined
      };
      
      const response = await this.contingentPayments.getContingentPricing(pricingRequest);
      
      if (response.success) {
        this.pricingData = response.data;
      } else {
        if (response.fallback_pricing) {
          this.pricingData = response.fallback_pricing.data;
        }
        
        if (response.error) {
          Swal.fire({
            title: 'Coupon Error',
            text: response.error,
            icon: 'warning',
            confirmButtonText: 'Continue without coupon'
          });
          this.couponCode = '';
        }
      }
    } catch (error) {
      console.error('Error updating pricing:', error);
    } finally {
      this.isLoadingPrice = false;
    }
  }

  async processPayment() {
    if (!this.pricingData || this.pricingData.final_amount === 0) {
      return;
    }

    const success = await this.contingentPayments.processContingentPayment(
      this.memberUpgrades,
      this.couponCode?.trim() || undefined,
      'hosted'
    );

    if (success) {
      await this.loadContingentMembers();
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async addMember() {
    if (!this.member_email?.trim()) {
      Swal.fire('Error', 'Please enter an email address', 'error');
      return;
    }

    if (!this.isValidEmail(this.member_email.trim())) {
      Swal.fire('Error', 'Please enter a valid email address', 'error');
      return;
    }

    try {
      const response = await this.contingentPayments.addContingentMember(this.member_email.trim());
      this.member_email = '';
      
      if (response.user_registered) {
        Swal.fire({
          title: 'Success',
          text: response.message,
          icon: 'success'
        });
      } else {
        Swal.fire({
          title: 'Invitation Sent',
          text: response.message,
          icon: 'info'
        });
      }
      
      this.loadContingentMembers();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  }

  async deleteMember(member_id: number) {
    const confirm = await Swal.fire({
      title: 'Remove Member',
      text: 'Are you sure you want to remove this member from the contingent?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Cancel'
    });

    if (!confirm.isConfirmed) {
      return;
    }

    try {
      const response = await this.contingentPayments.removeContingentMember(member_id);
      Swal.fire({
        title: 'Success',
        text: 'Member removed successfully',
        icon: 'success'
      });
      this.loadContingentMembers();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  }


  async deleteContingent() {
    const confirm = await Swal.fire({
      title: 'Delete Contingent',
      text: 'Are you sure you want to delete the entire contingent? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel'
    });

    if (!confirm.isConfirmed) {
      return;
    }

    try {
      await this.http.delete(
        `${environment.API_URL}/${Endpoint.CONTINGENT}`,
        { headers: this.auth.headers }
      ).toPromise();
      
      Swal.fire({
        title: 'Success',
        text: 'Contingent deleted successfully',
        icon: 'success'
      });
      
      this.pageState = PageStates.EMPTY;
    } catch (error) {
      console.error('Error deleting contingent:', error);
      handleAPIException(getErrorMessage(error));
    }
  }

  getLeaderInfo(): any {
    return this.pricingData?.breakdown?.find((member: any) => member.is_leader);
  }

  isCurrentUser(member: any): boolean {
    const currentUserEmail = this.auth.getStoredUserInfo('email');
    return member.member_email === currentUserEmail;
  }

  currentUserHasContingentPass(): boolean {
    const currentUserEmail = this.auth.getStoredUserInfo('email');
    const currentUser = this.pricingData?.breakdown?.find((member: any) => 
      member.member_email === currentUserEmail
    );
    return currentUser?.bought_by_contingent || false;
  }

  getPendingPassForMember(member: any): string | null {
    if (!member.bought_by_contingent || member.entered_contingent) {
      return null;
    }
    return member.purchased_pass || null;
  }
}