import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private base = environment.apiBase;

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
    return this.http.post(`${this.base}/register-driver`, driverData);
  }
//   findDrivers(rideId: number): Observable<any> {
//   return this.http.get(`${this.base}/find-drivers/${rideId}`, this.getAuthHeaders());
// }


createRideAndFetchDrivers(data: any): Observable<any> {
  return this.http.post(`${this.base}/create-and-find-drivers`, data, this.getAuthHeaders());
}

confirmRide(data: any): Observable<any> {
  return this.http.post(`${this.base}/confirm-ride`, data, this.getAuthHeaders());
}

getUserRides(): Observable<any> {
  return this.http.get(`${this.base}/user/rides`, this.getAuthHeaders());
}

 cancelRide(rideId: number, reason: string): Observable<any> {
    return this.http.post(
      `${this.base}/cancel-ride/${rideId}`,
      { reason },
      this.getAuthHeaders()
    );
  }

  
}
