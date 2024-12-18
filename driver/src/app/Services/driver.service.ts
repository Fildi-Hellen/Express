import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

   private baseUrl = 'http://localhost:8000/api'; // Your Laravel backend base URL

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getDriverOrders(driverId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/drivers/${driverId}/orders`, { headers });
  }


  // Register a new driver
  registerDriver(driverData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/drivers/register`, driverData);
  }

  // Login a driver
  loginDriver(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/drivers/login`, credentials);
  }

  // Logout a driver
  logoutDriver(): Observable<any> {
    return this.http.post(`${this.baseUrl}/drivers/logout`, {});
  }
  
  // uploadProfilePicture(picture: string): void {
  //   this.profilePicture = picture;
  // }

  // getProfilePicture(): string | null {
  //   return this.profilePicture;
  // }

  // Fetch available drivers (optional)
  getAvailableDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/drivers/available`);
  }

  // Assign a driver to an order
  assignDriver(orderId: number, driverId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/${orderId}/assign-driver`, { driverId });
  }

 

  // Update the status of an order
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}/status`, { status });
  }

  
}
