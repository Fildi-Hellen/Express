import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() {}

  getEarningsOverview(): Observable<any> {
    // Mock data for daily, weekly, monthly earnings
    const data = {
      daily: 120.50,
      weekly: 800.00,
      monthly: 3200.00
    };
    return of(data);
  }

  getPaymentHistory(): Observable<any[]> {
    // Mock array of transaction history
    const history = [
      { date: new Date(), amount: 25.50, type: 'Trip Fare', notes: 'Ride from A to B' },
      { date: new Date(), amount: 10.00, type: 'Bonus', notes: 'Weekly performance bonus' },
      { date: new Date(), amount: -5.00, type: 'Deduction', notes: 'Late cancellation penalty' }
    ];
    return of(history);
  }

  getPayoutSettings(): Observable<any> {
    // Mock payout method data
    const settings = {
      method: 'Bank Account',
      accountName: 'John Doe',
      accountNumber: 'XXXX-XXXX-1234',
      bankName: 'Acme Bank'
    };
    return of(settings);
  }

  updatePayoutSettings(newSettings: any): Observable<any> {
    // In a real scenario, this would send an HTTP request to update the settings on the server
    return of({ success: true });
  }

  initiateWithdrawal(amount: number): Observable<any> {
    // Simulate a withdrawal initiation
    return of({ success: true, message: `Withdrawal of $${amount.toFixed(2)} initiated.` });
  }
  
}
