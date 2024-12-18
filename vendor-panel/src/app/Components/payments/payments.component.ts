import { Component } from '@angular/core';
import { PaymentService } from '../../Services/payment.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  vendorId = 1;  // This should be dynamically assigned based on the logged-in vendor's ID.
  subscriptions: any;
  payoutDetails: any;
  invoiceAmount!: number;
  paymentAmount!: number;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadSubscriptions();
    this.loadPayoutDetails();
  }

  loadSubscriptions(): void {
    this.paymentService.getSubscriptions(this.vendorId).subscribe(
      data => { this.subscriptions = data; },
      error => { console.error('Failed to load subscriptions', error); }
    );
  }

  loadPayoutDetails(): void {
    this.paymentService.getPayoutDetails(this.vendorId).subscribe(
      data => { this.payoutDetails = data; },
      error => { console.error('Failed to load payout details', error); }
    );
  }

  createInvoice(amount: number): void {
    const invoiceData = { amount: amount, vendorId: this.vendorId };
    this.paymentService.createInvoice(invoiceData).subscribe(
      response => { alert('Invoice created successfully!'); },
      error => { console.error('Error creating invoice:', error); }
    );
  }

  requestPayment(amount: number): void {
    const paymentData = { amount: amount, vendorId: this.vendorId };
    this.paymentService.requestPayment(paymentData).subscribe(
      response => { alert('Payment request sent successfully!'); },
      error => { console.error('Error requesting payment:', error); }
    );
  }

  updateSubscription(subscriptionId: number, newPlan: string): void {
    this.paymentService.updateSubscription(subscriptionId, { newPlan: newPlan }).subscribe(
      response => { alert('Subscription updated successfully!'); },
      error => { console.error('Error updating subscription:', error); }
    );
  }

  requestPayout(): void {
    const payoutData = { vendorId: this.vendorId, amount: 1000 }; // Example data
    this.paymentService.requestPayout(payoutData).subscribe(
      response => { alert('Payout requested successfully!'); },
      error => { console.error('Error requesting payout:', error); }
    );
  }


}
