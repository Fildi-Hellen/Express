import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
private base = environment.apiBase;


  constructor(private http: HttpClient) { }

  // Invoice management
  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post(`${this.base}/invoices`, invoiceData);
  }

  // Payment requests
  requestPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.base}/payments/request`, paymentData);
  }

  // Subscription management
  getSubscriptions(vendorId: number): Observable<any> {
    return this.http.get(`${this.base}/${vendorId}/subscriptions`);
  }

  updateSubscription(subscriptionId: number, updateData: any): Observable<any> {
    return this.http.patch(`${this.base}/subscriptions/${subscriptionId}`, updateData);
  }

  // Payout management
  getPayoutDetails(vendorId: number): Observable<any> {
    return this.http.get(`${this.base}/${vendorId}/payout-details`);
  }

  requestPayout(payoutData: any): Observable<any> {
    return this.http.post(`${this.base}/payouts`, payoutData);
  }

}
