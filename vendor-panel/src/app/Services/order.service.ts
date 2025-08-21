import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

private base = environment.apiBase;

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
    return this.http.get(`${this.base}/vendor-orders`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Error fetching vendor orders:', error);
        return throwError(() => new Error('Failed to fetch vendor orders'));
      })
    );
  }
  

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.patch(`${this.base}/update-status/${orderId}`, { status });
  }

  getAllDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/drivers`, {
      headers: this.getAuthHeaders(),
    });
  }
  
  

  assignDriver(orderId: number, driverId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.base}/orders/${orderId}/assign-driver`, { driverId }, { headers }).pipe(
      catchError((error) => {
        console.error('Error assigning driver:', error);
        return throwError(() => new Error('Failed to assign driver'));
      })
    );
  }
  
  getAvailableDrivers(): Observable<any[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<any[]>(`${this.base}/drivers/available`, { headers }).pipe(
    catchError((error) => {
      console.error('Error fetching available drivers:', error);
      return throwError(() => new Error('Failed to fetch drivers'));
    })
  );
}


  getDriverOrders(driverId: number): Observable<any> {
    return this.http.get(`${this.base}/driver-orders/${driverId}`);
  }

 
  
}
