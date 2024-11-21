import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface PaymentResponse {
  status: string;
  message: string;
  clientSecret?: string; // This ensures that clientSecret is optional and included in the response
}

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private apiUrl = 'http://your-backend-api-url'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  // Stripe Payment: Create a Payment Intent and get the clientSecret
  createStripePayment(amount: number): Observable<PaymentResponse> {
    const paymentData = { amount };
    return this.http.post<PaymentResponse>(`${this.apiUrl}/stripe/payment`, paymentData);
  }

  // MOMO Payment: Send payment request for MOMO
  createMomoPayment(amount: number, accountNumber: string): Observable<PaymentResponse> {
    const paymentData = { amount, accountNumber };
    return this.http.post<PaymentResponse>(`${this.apiUrl}/momo/payment`, paymentData);
  }

  // Mpase Payment: Send payment request for Mpase
  createMpasePayment(amount: number, accountNumber: string): Observable<PaymentResponse> {
    const paymentData = { amount, accountNumber };
    return this.http.post<PaymentResponse>(`${this.apiUrl}/mpase/payment`, paymentData);
  }



}
