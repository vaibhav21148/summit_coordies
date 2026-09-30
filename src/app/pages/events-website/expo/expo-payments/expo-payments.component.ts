import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';

declare var Razorpay: any;

interface PaymentData {
  id: number;
  organisation_name: string;
  contact_name: string;
  contact_number: string;
  email: string;
  stall_type: string;
  amount: number;
  amount_display: string;
  is_paid: boolean;
  invoice_pdf: string;
}

interface PaymentStatus {
  has_entry: boolean;
  payment_data?: PaymentData;
  can_pay: boolean;
  message?: string;
}

@Component({
  selector: 'app-expo-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expo-payments.component.html',
  styleUrls: ['./expo-payments.component.css']
})
export class ExpoPaymentsComponent implements OnInit {
  paymentStatus: PaymentStatus | null = null;
  loading = true;
  processing = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.checkPaymentStatus();
  }

  checkPaymentStatus() {
    this.http.get<PaymentStatus>(`${environment.API_URL}/payments/expo/status/`)
      .subscribe({
        next: (data) => {
          this.paymentStatus = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error checking payment status:', error);
          this.loading = false;
        }
      });
  }

  initiatePayment() {
    if (!this.paymentStatus?.can_pay) return;

    this.processing = true;

    this.http.post<any>(`${environment.API_URL}/payments/expo/create/`, {})
      .subscribe({
        next: (orderData) => {
          this.openRazorpay(orderData);
        },
        error: (error) => {
          console.error('Error creating payment order:', error);
          this.processing = false;
        }
      });
  }

  openRazorpay(orderData: any) {
    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.order_id,
      name: 'E-Cell IIT Bombay',
      image:
        'https://esummit24.s3.ap-south-1.amazonaws.com/E-cell+Logo+black.jpg',
      description: `Payment for ${this.paymentStatus?.payment_data?.organisation_name}`,
      prefill: {
        email: this.paymentStatus?.payment_data?.email,
        contact: this.paymentStatus?.payment_data?.contact_number,
      },
      theme: {
        color: '#FF7A1A',
      },
      handler: (response: any) => {
        this.verifyPayment(response);
      },
      modal: {
        ondismiss: () => {
          this.processing = false;
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  verifyPayment(response: any) {
    const verificationData = {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    };

    this.http.post<any>(`${environment.API_URL}/payments/expo/verify/`, verificationData)
      .subscribe({
        next: (data) => {
          if (data.success) {
            Swal.fire({
              title: 'Payment Successful!',
              text: 'Your expo payment has been processed successfully. Receipt has been generated.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.checkPaymentStatus();
            });
          }
          this.processing = false;
        },
        error: (error) => {
          console.error('Payment verification failed:', error);
          Swal.fire({
            title: 'Payment Failed',
            text: 'Payment verification failed. Please contact support.',
            icon: 'error'
          });
          this.processing = false;
        }
      });
  }

  downloadInvoice() {
    const endpoint = this.paymentStatus?.payment_data?.is_paid
      ? '/payments/expo/receipt/'
      : '/payments/expo/invoice/';

    this.http.get(`${environment.API_URL}${endpoint}`, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const orgName = this.paymentStatus?.payment_data?.organisation_name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Organization';
          const docType = this.paymentStatus?.payment_data?.is_paid ? 'Receipt' : 'Invoice';
          const filename = `${orgName}_22nd_ESummit_Startup_Expo_${docType}.pdf`;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error downloading file:', error);
          Swal.fire({
            title: 'Download Failed',
            text: 'Error downloading file. Please try again.',
            icon: 'error'
          });
        }
      });
  }
}