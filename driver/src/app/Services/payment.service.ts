import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  getEarningsOverview() {
    return this.http.get<any>(`${this.base}/earnings`);
  }

  getPaymentHistory() {
    return this.http.get<any[]>(`${this.base}/history`);
  }

  getPayoutSettings() {
    return this.http.get<any>(`${this.base}/settings`);
  }

  updatePayoutSettings(data: any) {
    return this.http.post<any>(`${this.base}/settings`, data);
  }

  initiateWithdrawal(amount: number) {
    return this.http.post<any>(`${this.base}/withdraw`, { amount });
  }
}
