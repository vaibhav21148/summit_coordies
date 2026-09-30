import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@services/auth.service';
import { environment } from 'src/environments/environment';
import { inject } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-konfhub-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="konfhub-widget-overlay" (click)="closeWidget()">
      <div class="konfhub-widget-container" (click)="$event.stopPropagation()">
        <button class="close-button" (click)="closeWidget()">&times;</button>
        <iframe 
          #konfhubFrame
          [src]="widgetUrl" 
          id="konfhub-widget" 
          title="Register for 22nd E-Summit Accommodation" 
          width="100%" 
          height="100%"
          frameborder="0">
        </iframe>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      z-index: 999999 !important;
      pointer-events: auto !important;
    }
    
    .konfhub-widget-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0, 0, 0, 0.8) !important;
      z-index: 999999 !important;
      display: flex !important;
      justify-content: center !important;
      align-items: flex-start !important;
      padding-top: 10vh !important;
    }
    
    .konfhub-widget-container {
      position: relative !important;
      width: 90vw !important;
      height: 80vh !important;
      background: white !important;
      border-radius: 10px !important;
      overflow: hidden !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
    }
    
    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background: red;
      border: none;
      font-size: 30px;
      color: white;
      cursor: pointer;
      z-index: 10001;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .close-button:hover {
      background: rgba(255, 255, 255, 1);
      color: #333;
    }
    
    iframe {
      border: none;
      width: 100%;
      height: 100%;
    }
  `]
})
export class KonfhubWidgetComponent implements OnInit, OnDestroy {
  @Input() userEmail?: string;
  @Input() userName?: string;
  @Input() accommodationId?: string;
  @Input() numberOfMales?: number;
  @Input() numberOfFemales?: number;
  @Input() totalParticipants?: number;
  @Input() unpaidCount?: number;
  @Output() paymentCompleted = new EventEmitter<void>();
  @ViewChild('konfhubFrame') iframe!: ElementRef<HTMLIFrameElement>;

  widgetUrl!: SafeResourceUrl;
  private messageListener?: (event: MessageEvent) => void;
  private paymentCheckSubscription?: any;

  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.buildWidgetUrl();
    this.setupMessageListener();
    this.startPaymentStatusCheck();
    // Move widget to body to avoid parent positioning issues
    setTimeout(() => {
      const hostElement = document.querySelector('app-konfhub-widget');
      if (hostElement) {
        document.body.appendChild(hostElement);
      }
    });
  }

  ngOnDestroy() {
    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
    }
    if (this.paymentCheckSubscription) {
      this.paymentCheckSubscription.unsubscribe();
    }
  }

  private buildWidgetUrl() {
    console.log('=== QUANTITY CALCULATION DEBUG ===');
    console.log('Raw unpaidCount input:', this.unpaidCount);
    console.log('Type of unpaidCount:', typeof this.unpaidCount);
    console.log('unpaidCount === undefined:', this.unpaidCount === undefined);
    console.log('unpaidCount === null:', this.unpaidCount === null);
    console.log('unpaidCount === 0:', this.unpaidCount === 0);

    // Use unpaidCount for groups, or 1 for individuals
    const quantity = this.unpaidCount || 1;

    console.log('Calculated quantity:', quantity);
    console.log('=== END QUANTITY DEBUG ===');

    console.log('Building widget URL with:', {
      email: this.userEmail,
      name: this.userName,
      accommodationId: this.accommodationId,
      numberOfMales: this.numberOfMales,
      numberOfFemales: this.numberOfFemales,
      totalParticipants: this.totalParticipants,
      unpaidCount: this.unpaidCount,
      quantity: quantity
    });

    const baseUrl = 'https://konfhub.com/widget/esummitacco';
    const params = new URLSearchParams({
      desc: 'false',
      secondaryBg: 'F7F7F7',
      ticketBg: 'F7F7F7',
      borderCl: 'F7F7F7',
      bg: 'FFFFFF',
      fontColor: '1e1f24',
      ticketCl: '1e1f24',
      btnColor: '002E6E',
      fontFamily: 'Prompt',
      borderRadius: '10',
      widget_type: 'quick',
      screen: '2',
      tickets: '66000',
      ticketId: `66000|${quantity}`
    });

    // Always add a default email if none provided
    const email = this.userEmail || 'user@example.com';
    console.log('Adding email parameter:', email);
    params.append('email_id', email);

    const name = this.userName || '';
    console.log('Adding name parameter:', name);
    if (name) {
      params.append('name', name);
    }

    // Add accommodation ID and participant details if available
    if (this.accommodationId) {
      console.log('Adding Accommodation ID as custom field:', this.accommodationId);
      const customFields = JSON.stringify({
        "Accommodation ID": this.accommodationId,
        "Number of Males": this.numberOfMales || 0,
        "Number of Females": this.numberOfFemales || 0,
        "Total Participants": this.totalParticipants || 0,
        "Unpaid Count": this.unpaidCount || 0
      });
      params.append('custom_fields', customFields);
    }

    const fullUrl = `${baseUrl}?${params.toString()}`;
    console.log('Final KonfHub URL:', fullUrl);
    console.log('All URL parameters:', params.toString());
    this.widgetUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }

  private setupMessageListener() {
    this.messageListener = (event: MessageEvent) => {
      if (event.origin === 'https://konfhub.com') {
        if (event.data.type === 'payment_success' ||
          event.data.type === 'registration_complete' ||
          event.data.type === 'payment_completed') {
          console.log('Frontend: Closing widget after payment completion');
          this.closeWidget();
        }
      }
    };

    window.addEventListener('message', this.messageListener);
  }

  private startPaymentStatusCheck() {
    this.paymentCheckSubscription = interval(5000).subscribe(() => {
      this.checkPaymentStatus();
    });
  }

  private async checkPaymentStatus() {
    try {
      const response: any = await this.http.get(
        `${environment.API_URL}/payments/konfhub/status/`,
        { headers: this.authService.headers }
      ).toPromise();

      console.log('Payment status check response:', response);

      if (response.paid === true) {
        console.log('Frontend: Payment confirmed via webhook - closing widget');
        this.closeWidget();
      }
    } catch (error) {
      console.log('Payment status check error:', error);
    }
  }

  closeWidget() {
    if (this.paymentCheckSubscription) {
      this.paymentCheckSubscription.unsubscribe();
    }
    this.paymentCompleted.emit();
  }


}