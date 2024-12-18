import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl =  'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }
   // Add a method to get the auth token
   private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Or wherever you store the token
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  getVendorOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vendor-orders`);
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
    return this.http.post(`${this.apiUrl}/orders/${orderId}/assign-driver`, { driverId });
  }
  
  getAvailableDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/drivers/available`, {
      headers: this.getAuthHeaders(),
    });
  }
  
  



  getDriverOrders(driverId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/driver-orders/${driverId}`);
  }

 
  
}
