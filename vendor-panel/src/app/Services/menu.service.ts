import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getVendorProfile() {
    return this.http.get(`${this.baseUrl}/vendor/profile`);
  }

  addMenuItem(data: FormData) {
    return this.http.post<any>(`${this.baseUrl}/menu`,data);
  }

  deleteMenuItem(id: string) {
    return this.http.delete(`${this.baseUrl}/menu/${id}`);
  }
  

  submitToAdmin(menus: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/submit-menus`, { menus });
  }

}
