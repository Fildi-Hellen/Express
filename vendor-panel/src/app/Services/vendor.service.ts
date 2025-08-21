import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.base}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.base}/login`, data);
  }

  getProfile() {
    return this.http.get(`${this.base}/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  logout() {
    return this.http.post(`${this.base}/logout`, {}, {
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
