import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  registerDriver(driverData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-driver`, driverData);
  }
}
