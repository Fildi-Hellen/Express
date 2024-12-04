import { Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { StripeService } from '../Services/stripe.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stripe-payments',
  templateUrl: './stripe-payments.component.html',
  styleUrls:[ './stripe-payments.component.css']
})
export class StripePaymentsComponent {

  selectedPaymentMethod: string = 'stripe'; // Default method
  accountNumber: string = '';
  amount: number = 0;

  stripe: any;
  cardElement: any;

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    // Initialize Stripe if selected
    if (this.selectedPaymentMethod === 'stripe') {
      this.stripe = await loadStripe('your-stripe-public-key'); // Replace with your public key
      const elements = this.stripe.elements();
      this.cardElement = elements.create('card');
      this.cardElement.mount('#card-element');
    }
  }

  async processPayment() {
    const paymentData = {
      method: this.selectedPaymentMethod,
      accountNumber: this.accountNumber || null,
      amount: this.amount || null,
    };

    if (this.selectedPaymentMethod === 'stripe') {
      const clientSecret = await this.createStripePayment();
      this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: 'Customer Name',
          },
        },
      }).then((result: any) => {
        if (result.error) {
          console.error('Payment error:', result.error.message);
        } else {
          console.log('Stripe payment successful!');
        }
      });
    } else {
      this.http.post('/api/payment', paymentData).subscribe(
        (response) => {
          console.log('Payment successful', response);
          alert('Payment confirmed!');
        },
        (error) => {
          console.error('Payment error', error);
          alert('Payment failed!');
        }
      );
    }
  }

  private createStripePayment(): Promise<string> {
    // Mock API call to get client secret
    return new Promise((resolve) => resolve('client_secret_example'));
  }
}
