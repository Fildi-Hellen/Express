import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Order } from '../Shared1/models/Order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private API_URL = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.API_URL}/orders/create`, order);
  }
  


  getNewOrderForCurrentUser(): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/orders/newForCurrentUser`);
  }

  
  pay(order: Order): Observable<string> {
    return this.http.post<string>(`${this.API_URL}/orders/pay`, order);
  }

  trackOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/orders/track/${id}`);
  }
  // getOrderDetails(orderId: number): Observable<Order> {
  //   return this.http.get<Order>(`${this.API_URL}}/${orderId}`);
  // }
  getOrders(): Observable<any> {
    return this.http.get(`${this.API_URL}/orders`);
  }

  getOrderDetails(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/orders/${id}`);
  }

  updateOrderStatus(Id: number, status: string): Observable<any> {
    return this.http.put(`${this.API_URL}/orders/${Id}/status`, { status });
  }

  confirmOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/confirm-order`, orderData);
  }

  saveRecipient(recipientData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/save-recipient`, recipientData);
  }

  saveAddress(addressData: { fullName: string; locationAddress: string; contact: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/address`, addressData);
  }
  savePaymentMethod(paymentData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/save-payment`, paymentData);
  }  


  trackOrder(trackingId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/track-order/${trackingId}`).pipe(
      catchError((error) => {
        console.error('Error tracking order:', error);
        return throwError(() => new Error('Tracking failed'));
      })
    );
  }

  
}

