import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No auth token; please log in.');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /** New trip requests (pending) */
  getTripRequests(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/driver/rides/requests`,
      { headers: this.getAuthHeaders() }
    );
  }

  /** Rides the driver has accepted */
  getCurrentTrips(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/driver/rides/current`,
      { headers: this.getAuthHeaders() }
    );
  }

  /** Accept a pending ride */
  acceptTrip(request: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/driver/rides/${request.id}/accept`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  /** Cancel a previously confirmed ride */
  declineTrip(request: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/driver/rides/${request.id}/cancel`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
  getTripHistory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  

}
