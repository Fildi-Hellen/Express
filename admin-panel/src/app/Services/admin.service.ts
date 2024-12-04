import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendor } from '../Models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://127.0.0.1:8000/api/admin'; // Note the '/admin' added here

  constructor(private http: HttpClient) {}

  getIncomingMenus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/menus`);
  }

  approveMenu(menuId: string, additionalPrice: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/menus/${menuId}/approve`, { additionalPrice });
  }

  disapproveMenu(menuId: string, reason: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/menus/${menuId}/disapprove`, { reason });
  }

  editMenu(menuId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/menus/${menuId}/edit`, updatedData);
  }
  
  getUnverifiedVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.baseUrl}/unverified-vendors`);
  }

  verifyVendor(vendorId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-vendor/${vendorId}`, {});
  }

  rejectVendor(vendorId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/reject-vendor/${vendorId}`, {});
  }

  requestMoreInfo(vendorId: number, message: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/request-more-info/${vendorId}`, { message });
  }

}

