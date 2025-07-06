import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}
  private getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

  registerDriver(driverData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-driver`, driverData);
  }
//   findDrivers(rideId: number): Observable<any> {
//   return this.http.get(`${this.apiUrl}/find-drivers/${rideId}`, this.getAuthHeaders());
// }


createRideAndFetchDrivers(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/create-and-find-drivers`, data, this.getAuthHeaders());
}

confirmRide(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/confirm-ride`, data, this.getAuthHeaders());
}

getUserRides(): Observable<any> {
  return this.http.get(`${this.apiUrl}/user/rides`, this.getAuthHeaders());
}

 cancelRide(rideId: number, reason: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/cancel-ride/${rideId}`,
      { reason },
      this.getAuthHeaders()
    );
  }

  
}
