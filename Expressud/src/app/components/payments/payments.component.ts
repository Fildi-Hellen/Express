import { Component } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls:[ './payments.component.css']
})
export class PaymentsComponent {
  selectedPaymentMethod = '';

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    alert(`Payment method selected: ${method}`);
  }

  completePayment(): void {
    if (!this.selectedPaymentMethod) {
      alert('Please select a payment method.');
      return;
    }
    alert(`Order placed successfully with ${this.selectedPaymentMethod}`);
  }

}

