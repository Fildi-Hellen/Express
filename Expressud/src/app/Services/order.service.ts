import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Order } from '../Shared1/models/Order';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

private base = environment.apiBase;
  constructor(private http: HttpClient) { }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.base}/orders/create`, order);
  }
  

  

  getNewOrderForCurrentUser(): Observable<Order> {
    return this.http.get<Order>(`${this.base}/orders/newForCurrentUser`);
  }

  
  pay(order: Order): Observable<string> {
    return this.http.post<string>(`${this.base}/orders/pay`, order);
  }

  trackOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.base}/orders/track/${id}`);
  }
  // getOrderDetails(orderId: number): Observable<Order> {
  //   return this.http.get<Order>(`${this.base}}/${orderId}`);
  // }
  getOrders(): Observable<any> {
    return this.http.get(`${this.base}/orders`);
  }

  getOrderDetails(id: number): Observable<any> {
    return this.http.get(`${this.base}/orders/${id}`);
  }

  updateOrderStatus(Id: number, status: string): Observable<any> {
    return this.http.put(`${this.base}/orders/${Id}/status`, { status });
  }

  confirmOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.base}/confirm-order`, orderData);
  }

  saveRecipient(recipientData: any): Observable<any> {
    return this.http.post(`${this.base}/save-recipient`, recipientData);
  }

  saveAddress(addressData: { fullName: string; locationAddress: string; contact: string }): Observable<any> {
    return this.http.post(`${this.base}/address`, addressData);
  }
  savePaymentMethod(paymentData: any): Observable<any> {
    return this.http.post(`${this.base}/save-payment`, paymentData);
  }  


  trackOrder(trackingId: string): Observable<any> {
    return this.http.get<any>(`${this.base}/track-order/${trackingId}`).pipe(
      catchError((error) => {
        console.error('Error tracking order:', error);
        return throwError(() => new Error('Tracking failed'));
      })
    );
  }

  
}

