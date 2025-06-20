import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  initiatePayment(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pay/initiate`, payload);
  }

  // Optional future addition
  confirmWebhook(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/webhook/flutterwave`, data);
  }



}
