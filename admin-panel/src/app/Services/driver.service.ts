import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

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
 

  getAllDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/drivers`, {
      headers: this.getAuthHeaders(),
    });
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


  

 
  toggleDriverStatus(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/drivers/${id}/toggle-status`, {});
  }

 

}
