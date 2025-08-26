import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

private base = environment.apiBase;


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
  const headers = this.getAuthHeaders();
  return this.http.get<any[]>(
    `${this.base}/drivers/${driverId}/orders`,
    { headers }
  );
}

  

  registerDriver(driverData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  vehicle_type: string;
  vehicle_number: string;
}): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  
  return this.http.post(`${this.base}/drivers/register`, driverData, { headers }).pipe(
    tap((response: any) => {
      console.log('Registration response:', response);
      // Auto-store token if provided
      if (response.token && response.driver) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('driverId', response.driver.id);
      }
    }),
    catchError((error) => {
      console.error('Registration error:', error);
      return throwError(() => error);
    })
  );
}


  loginDriver(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.base}/drivers/login`, credentials).pipe(
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
    return this.http.post(`${this.base}/drivers/logout`, {});
  }
  
  
  // Get driver profile by ID
  getDriverProfile(driverId?: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const id = driverId || localStorage.getItem('driverId');
    return this.http.get<any>(`${this.base}/drivers/${id}/profile`, { headers });
  }
  
  // Update driver profile
  updateDriverProfile(profileData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const driverId = localStorage.getItem('driverId');
    return this.http.put<any>(`${this.base}/drivers/${driverId}/profile`, profileData, { headers });
  }

  // Upload profile picture
  uploadProfilePicture(file: File): Observable<any> {
    const headers = this.getAuthHeaders();
    // Remove Content-Type header to let browser set it with boundary for FormData
    const authHeaders = new HttpHeaders({
      'Authorization': headers.get('Authorization') || ''
    });
    
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    const driverId = localStorage.getItem('driverId');
    return this.http.post<any>(
      `${this.base}/drivers/${driverId}/profile-picture`, 
      formData, 
      { headers: authHeaders }
    );
  }

  // Remove profile picture
  removeProfilePicture(): Observable<any> {
    const headers = this.getAuthHeaders();
    const driverId = localStorage.getItem('driverId');
    return this.http.delete<any>(`${this.base}/drivers/${driverId}/profile-picture`, { headers });
  }
  
  updateOrderStatus(orderId: number, status: string): Observable<any> {
    const headers = this.getAuthHeaders(); // Include the authorization headers
    return this.http.put(`${this.base}/orders/${orderId}/status`, { status }, { headers });
  }
  
  // getAvailableDrivers(pickup: string, destination: string): Observable<Driver[]> {
  //   return this.http.post<Driver[]>('/api/rides/available-drivers', {
  //     pickup,
  //     destination
  //   });
  // }
  
  confirmBooking(rideData: any): Observable<any> {
    return this.http.post('/api/rides/confirm', rideData);
  }

  findDrivers(rideId: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get(`${this.base}/find-drivers/${rideId}`, { headers });
}

  
}
