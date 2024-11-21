import { Component } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { StripeService } from '../Services/stripe.service';

@Component({
  selector: 'app-stripe-payments',
  templateUrl: './stripe-payments.component.html',
  styleUrl: './stripe-payments.component.css'
})
export class StripePaymentsComponent {

  stripe: any;
  elements: any;
  cardElement: any;
  accountNumber: string = '';
  amount: number = 0;
  selectedPaymentMethod: string = 'stripe'; // Default payment method
  
  constructor(private stripeService: StripeService) {}

  async ngOnInit() {
    // Initialize Stripe.js
    this.stripe = await loadStripe('your-stripe-public-key'); // Replace with your public key
    const elements = this.stripe.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount('#card-element');
  }

  // General payment process handler
  processPayment(amount: number, selectedPaymentMethod: string) {
    switch (selectedPaymentMethod) {
      case 'stripe':
        this.processStripePayment(amount);
        break;
      case 'momo':
        this.processMomoPayment(amount, this.accountNumber);
        break;
      case 'mpase':
        this.processMpasePayment(amount, this.accountNumber);
        break;
      default:
        console.error('Invalid payment method');
    }
  }

  // Stripe Payment Processing
  processStripePayment(amount: number) {
    this.stripeService.createStripePayment(amount).subscribe(
      (response) => {
        const clientSecret = response.clientSecret;
        this.stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.cardElement,
            billing_details: {
              name: 'Customer Name',
            },
          },
        }).then((result: any) => {
          if (result.error) {
            console.error(result.error.message);
          } else {
            console.log('Stripe payment succeeded!');
          }
        });
      },
      (error) => {
        console.error('Error processing Stripe payment:', error);
      }
    );
  }

  // MOMO Payment Processing
  processMomoPayment(amount: number, accountNumber: string) {
    this.stripeService.createMomoPayment(amount, accountNumber).subscribe(
      (response) => {
        console.log('MOMO payment succeeded:', response);
      },
      (error) => {
        console.error('Error processing MOMO payment:', error);
      }
    );
  }

  // Mpase Payment Processing
  processMpasePayment(amount: number, accountNumber: string) {
    this.stripeService.createMpasePayment(amount, accountNumber).subscribe(
      (response) => {
        console.log('Mpase payment succeeded:', response);
      },
      (error) => {
        console.error('Error processing Mpase payment:', error);
      }
    );
  }


}
