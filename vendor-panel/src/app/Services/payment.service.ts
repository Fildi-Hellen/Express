import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://your-api-url/api';


  constructor(private http: HttpClient) { }

  // Invoice management
  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/invoices`, invoiceData);
  }

  // Payment requests
  requestPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/request`, paymentData);
  }

  // Subscription management
  getSubscriptions(vendorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${vendorId}/subscriptions`);
  }

  updateSubscription(subscriptionId: number, updateData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/subscriptions/${subscriptionId}`, updateData);
  }

  // Payout management
  getPayoutDetails(vendorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${vendorId}/payout-details`);
  }

  requestPayout(payoutData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payouts`, payoutData);
  }

}
