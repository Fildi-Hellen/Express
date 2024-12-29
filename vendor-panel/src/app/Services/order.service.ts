import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl =  'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('Authentication token missing');
      throw new Error('Authentication required');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  
  


  getVendorOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vendor-orders`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Error fetching vendor orders:', error);
        return throwError(() => new Error('Failed to fetch vendor orders'));
      })
    );
  }
  

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update-status/${orderId}`, { status });
  }

  getAllDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/drivers`, {
      headers: this.getAuthHeaders(),
    });
  }
  
  

  assignDriver(orderId: number, driverId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/orders/${orderId}/assign-driver`, { driverId }, { headers }).pipe(
      catchError((error) => {
        console.error('Error assigning driver:', error);
        return throwError(() => new Error('Failed to assign driver'));
      })
    );
  }
  
  getAvailableDrivers(): Observable<any[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<any[]>(`${this.apiUrl}/drivers/available`, { headers }).pipe(
    catchError((error) => {
      console.error('Error fetching available drivers:', error);
      return throwError(() => new Error('Failed to fetch drivers'));
    })
  );
}


  getDriverOrders(driverId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/driver-orders/${driverId}`);
  }

 
  
}
