import { Component, EventEmitter, Output } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { StripeService } from '../Services/stripe.service';
import { HttpClient } from '@angular/common/http';
import { OrderService } from 'src/app/Services/order.service';

@Component({
  selector: 'app-stripe-payments',
  templateUrl: './stripe-payments.component.html',
  styleUrls:[ './stripe-payments.component.css']
})
export class StripePaymentsComponent {
  selectedPaymentMethod: string = 'stripe'; // Default method
  accountNumber: string = '';
  amount: number = 0;

  @Output() paymentMethodUpdated = new EventEmitter<string>();

  constructor(private http: HttpClient, private orderService: OrderService) {}

  processPayment(): void {
    const paymentData = {
      method: this.selectedPaymentMethod,
      accountNumber: this.accountNumber || null,
      amount: this.amount || null,
    };

    // Emit the selected payment method to the parent component
    this.paymentMethodUpdated.emit(this.selectedPaymentMethod);

    // Save payment method to backend
    this.orderService.savePaymentMethod(paymentData).subscribe(
      (response) => {
        console.log('Payment method saved:', response);
        alert('Payment method saved successfully!');
      },
      (error) => {
        console.error('Error saving payment method:', error);
        alert('Failed to save payment method. Please try again.');
      }
    );
  }
}
