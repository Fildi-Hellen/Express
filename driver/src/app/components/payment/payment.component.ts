import { Component } from '@angular/core';
import { PaymentService } from '../../Services/payment.service';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css'],
    standalone: false
})
export class PaymentComponent {

    earnings: any = {};
  paymentHistory: any[] = [];
  payoutSettings: any = {};
  withdrawalAmount: number = 0;
  

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadEarnings();
    this.loadPaymentHistory();
    this.loadPayoutSettings();
  }

  loadEarnings(): void {
    this.paymentService.getEarningsOverview().subscribe(data => {
      this.earnings = data;
    });
  }

  loadPaymentHistory(): void {
    this.paymentService.getPaymentHistory().subscribe(data => {
      this.paymentHistory = data;
    });
  }

  loadPayoutSettings(): void {
    this.paymentService.getPayoutSettings().subscribe(data => {
      this.payoutSettings = data;
    });
  }

  updateSettings(): void {
    this.paymentService.updatePayoutSettings(this.payoutSettings).subscribe(response => {
      if (response.success) {
        alert('Payout settings updated successfully!');
      }
    });
  }

  initiateWithdrawalRequest(): void {
    if (this.withdrawalAmount > 0) {
      this.paymentService.initiateWithdrawal(this.withdrawalAmount).subscribe(response => {
        if (response.success) {
          alert(response.message);
          this.withdrawalAmount = 0;
        }
      });
    } else {
      alert('Please enter a valid withdrawal amount.');
    }
  }


}
