import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

   private baseUrl = 'http://localhost:8000/api'; // Your Laravel backend base URL

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You are not authenticated. Please log in again.');
      window.location.href = '/login'; // Redirect to login page
      throw new Error('No authentication token found');
    }
    console.log('Authorization Header:', `Bearer ${token}`);
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  
  
  getDriverOrders(driverId: number): Observable<any[]> {
    // No headers are set for unauthenticated access
    return this.http.get<any[]>(`${this.baseUrl}/drivers/${driverId}/orders`);
  }
  

  // Register a new driver
  registerDriver(driverData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/drivers/register`, driverData);
  }

  loginDriver(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/drivers/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token && response.driver) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('driverId', response.driver.id); // Save driver ID
          console.log('Driver ID and token saved to localStorage');
        }
      }),
      catchError((error) => {
        console.error('Error during login:', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }
  

  // Logout a driver
  logoutDriver(): Observable<any> {
    return this.http.post(`${this.baseUrl}/drivers/logout`, {});
  }
  
  
  getDriverProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/drivers/profile`, { headers });
  }
  
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    const headers = this.getAuthHeaders(); // Include the authorization headers
    return this.http.put(`${this.baseUrl}/orders/${orderId}/status`, { status }, { headers });
  }
  
  
}
