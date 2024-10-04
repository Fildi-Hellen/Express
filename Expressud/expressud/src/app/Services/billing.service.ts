import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private apiUrl = 'https://your-api-url.com'; // Replace this with your backend API URL

  constructor(private http: HttpClient) { }

  sendBillingInfo(billingInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/billing`, billingInfo);
  }

  getAcceptedBillingInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/billing/accepted`);
  }
}
