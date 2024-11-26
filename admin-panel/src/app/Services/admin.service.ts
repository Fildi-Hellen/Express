import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Menu } from '../Models/menu.model';
import { Observable } from 'rxjs';
import { Vendor } from '../Models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getUnapprovedMenus() {
    return this.http.get<Menu[]>(`${this.baseUrl}/admin/unapproved-menus`);
  }

  approveMenu(menuId: number) {
    return this.http.post(`${this.baseUrl}/admin/approve-menu/${menuId}`, {});
  }

  getUnverifiedVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.baseUrl}/admin/unverified-vendors`);
  }

  verifyVendor(vendorId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/verify-vendor/${vendorId}`, {});
  }

  rejectVendor(vendorId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/reject-vendor/${vendorId}`, {});
  }

  requestMoreInfo(vendorId: number, message: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/request-more-info/${vendorId}`, { message });
  }

}

