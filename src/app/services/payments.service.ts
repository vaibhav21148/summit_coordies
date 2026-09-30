import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { handleAPIException, getErrorMessage } from 'src/app/utils/error';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

declare var Razorpay: any;

const SWAL_MESSAGES = {
  MODAL_WARNING:
    "Don't Click Back or Refresh Button until Payment is done. If you do so, your payment will be lost.",
  HOSTED_WARNING:
    "You will be redirected to the payment gateway. Don't Click Back or Refresh Button until Payment is done. If you do so, your payment may be lost.",
};

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  warnForPayment(type: 'modal' | 'hosted') {
    return Swal.fire({
      title: 'Note',
      text:
        type === 'modal'
          ? SWAL_MESSAGES.MODAL_WARNING
          : SWAL_MESSAGES.HOSTED_WARNING,
      icon: 'info',
      showConfirmButton: true,
      confirmButtonText: 'Pay Now',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
    });
  }
  attemptPayment(
    orderData: { order_id: string; email: string; contact: string },
    endpoint: Endpoint,
    description: string,
    type: 'modal' | 'hosted'
  ) {
    if (type === 'modal') {
      return this.attemptModalRzpPayment(orderData, endpoint, description);
    } else if (type === 'hosted') {
      return this.attemptHostedFormRzpPayment(orderData, endpoint, description);
    }
  }

  attemptHostedFormRzpPayment(
    orderData: { order_id: string; email: string; contact: string },
    endpoint: Endpoint,
    description: string
  ) {
    // 1. Create a form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://api.razorpay.com/v1/checkout/embedded';

    // 2. Create hidden input fields for each parameter
    const fields: Record<string, string> = {
      key_id: environment.RAZORPAY_CLIENT_ID, // e.g. "rzp_test_xxxxxxx"
      currency: 'INR',
      name: 'E-Cell IIT Bombay',
      image:
        'https://esummit24.s3.ap-south-1.amazonaws.com/E-cell+Logo+black.jpg',
      description: description,
      order_id: orderData.order_id, // from your backend
      'prefill[contact]': orderData.contact, // e.g. '+911234567890'
      'prefill[email]': orderData.email, // e.g. 'test@example.com'
      'theme[color]': '#000000',
      // your desired success callback
      callback_url: `${environment.API_URL}/${Endpoint.SUCCESS_PAYMENT}?verify=${endpoint}&redirect_to=${encodeURIComponent(environment.SELF_URL + this.getReturnLinkFromEndpoint(endpoint) + '?payment_success=true')}`,
      cancel_url: `${environment.SELF_URL}${this.getReturnLinkFromEndpoint(endpoint)}?payment_failed=true`, // your desired cancel callback
    };

    // 3. Append inputs to the form
    for (const name in fields) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = fields[name];
      form.appendChild(input);
    }

    // 4. Append the form to the body
    document.body.appendChild(form);

    // 5. Submit the form
    form.submit();
  }

  attemptModalRzpPayment(
    orderData: any,
    endpoint: Endpoint,
    description: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const options = {
        key: environment.RAZORPAY_CLIENT_ID,
        currency: 'INR',
        name: 'E-Cell IIT Bombay',
        image:
          'https://esummit24.s3.ap-south-1.amazonaws.com/E-cell+Logo+black.jpg',
        description: description,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          console.log('Razorpay response:', response); // Log the response
          if (
            response &&
            response.razorpay_payment_id &&
            response.razorpay_order_id
          ) {
            const success = await this.verifyPayment(response, endpoint); // Only call verifyPayment if response is valid
            if (success) {
              resolve(true);
            } else {
              reject(false);
            }
          } else {
            console.error('Invalid Razorpay response');
            Swal.fire({
              title: 'Payment Failed',
              text: 'Invalid payment response.',
              icon: 'error',
            });
            reject(false);
          }
        },
        prefill: {
          email: orderData.email,
          contact: orderData.contact,
        },
        theme: {
          color: '#000',
        },
        dismiss: {
          modal: {
            escape: false,
            ondismiss: () => {
              Swal.fire({
                title: 'Payment Failed',
                text: 'Your payment could not be processed.',
                icon: 'error',
              });
            },
          },
        },
      };

      const successCallback = (paymentId: any) => {
        console.log('Payment successful. Payment ID:', paymentId);
      };

      const failureCallback = (error: any) => {
        console.error('Payment failed. Error:', error);
      };

      const rzp = new Razorpay(options);
      // console.log('Opening Razorpay payment modal...');
      rzp.on('payment.success', successCallback);
      rzp.on('payment.failed', failureCallback);

      rzp.open();
    });
  }

  async verifyPayment(response: any, endpoint: Endpoint): Promise<boolean> {
    console.log('Verifying payment:', response);
    Swal.fire({
      title: 'Verifying Payment',
      text: 'Please wait while we verify your payment. Do not close or refresh this page.',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const result: any = await lastValueFrom(
        this.http.post(environment.API_URL + '/' + endpoint, {
          payment_id: response.razorpay_payment_id, // If modal
          order_id: response.razorpay_order_id, // If modal
          transit_id: response.transit_id, // If hosted form
        }, {
          headers: this.authService.headers
        })
      );
      Swal.close();
      await Swal.fire({
        title: 'Payment Successful',
        text: result.success ?? 'Your payment has been successfully processed.',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      });
      return true;
    } catch (error) {
      Swal.close();
      console.error('Payment verification error:', error);
      handleAPIException(
        getErrorMessage(error),
        'An error occurred while verifying your payment. Please try again later.'
      );
      return false;
    }
  }

  // Used when failed payments are redirected back to the website
  getReturnLinkFromEndpoint(endpoint: Endpoint) {
    switch (endpoint) {
      case Endpoint.ACCO_VERIFY_PAYMENT:
        return '/dashboard/accommodation';
      case Endpoint.VERIFY_MUN_PAYMENT:
        return '/entremun';
      case Endpoint.VERIFY_MUN_GROUP_PAYMENT:
        return '/entremun/dash';
      case Endpoint.VERIFY_WORKSHOP_PAYMENT:
        return '/workshops';
      case Endpoint.VERIFY_PASS_PAYMENT:
        return '/pass';
      case Endpoint.VERIFY_CONTINGENT_PAYMENT:
        return '/cl/dash';
      default:
        return '/';
    }
  }

  getFailureLinkFromEndpoint(endpoint: Endpoint) {
    switch (endpoint) {
      case Endpoint.ACCO_VERIFY_PAYMENT:
        return '/acco/reg';
      case Endpoint.VERIFY_MUN_PAYMENT:
        return '/entremun/reg';
      case Endpoint.VERIFY_MUN_GROUP_PAYMENT:
        return '/entremun/dash';
      case Endpoint.VERIFY_WORKSHOP_PAYMENT:
        return '/workshops/reg';
      case Endpoint.VERIFY_PASS_PAYMENT:
        return '/pass';
      case Endpoint.VERIFY_CONTINGENT_PAYMENT:
        return '/cl/dash';
      default:
        return '/';
    }
  }
}
