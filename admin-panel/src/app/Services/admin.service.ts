import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendor } from '../Models/vendor.model';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  getIncomingMenus(): Observable<any> {
    return this.http.get(`${this.base}/menus`);
  }

  approveMenu(menuId: string, additionalPrice: number): Observable<any> {
    return this.http.post(`${this.base}/menus/${menuId}/approve`, { additionalPrice });
  }

  disapproveMenu(menuId: string, reason: string): Observable<any> {
    return this.http.post(`${this.base}/menus/${menuId}/disapprove`, { reason });
  }

  editMenu(menuId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.base}/menus/${menuId}/edit`, updatedData);
  }
  
  getUnverifiedVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.base}/unverified-vendors`);
  }

  verifyVendor(vendorId: number): Observable<any> {
    return this.http.post(`${this.base}/verify-vendor/${vendorId}`, {});
  }

  rejectVendor(vendorId: number): Observable<any> {
    return this.http.post(`${this.base}/reject-vendor/${vendorId}`, {});
  }

  requestMoreInfo(vendorId: number, message: string): Observable<any> {
    return this.http.post(`${this.base}/request-more-info/${vendorId}`, { message });
  }

}

