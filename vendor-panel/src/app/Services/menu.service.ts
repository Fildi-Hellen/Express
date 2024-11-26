import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl = 'http://your-backend-api-url/api';

  constructor(private http: HttpClient) {}

  getVendorProfile() {
    return this.http.get(`${this.baseUrl}/vendor/profile`);
  }

  addMenuItem(data: FormData) {
    return this.http.post(`${this.baseUrl}/vendor/menus`, data);
  }
}
