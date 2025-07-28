import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

   private baseUrl = 'http://localhost:8000/api/vendor';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  getProfile() {
    return this.http.get(`${this.baseUrl}/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  
}
