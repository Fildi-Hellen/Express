import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getEarningsOverview() {
    return this.http.get<any>(`${this.baseUrl}/earnings`);
  }

  getPaymentHistory() {
    return this.http.get<any[]>(`${this.baseUrl}/history`);
  }

  getPayoutSettings() {
    return this.http.get<any>(`${this.baseUrl}/settings`);
  }

  updatePayoutSettings(data: any) {
    return this.http.post<any>(`${this.baseUrl}/settings`, data);
  }

  initiateWithdrawal(amount: number) {
    return this.http.post<any>(`${this.baseUrl}/withdraw`, { amount });
  }
}
