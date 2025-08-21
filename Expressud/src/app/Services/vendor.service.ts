import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

private base = environment.apiBase;
  constructor(private http: HttpClient) { }

  
/**
   * Register a new vendor.
   * @param vendorData Vendor registration data
   * @returns Observable<any>
   */
  registerVendor(vendorData: any): Observable<any> {
    const url = `${this.base}/vendor/register`;
    return this.http.post<any>(url, vendorData);
  }

  loginVendor(data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/vendor/login`, data);
  }
  
  resetPassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/vendor/forgot-password`, data);
  }
  

  /**
   * Get the profile of the currently authenticated vendor.
   * @returns Observable<any>
   */
  getVendorProfile(): Observable<any> {
    const url = `${this.base}/vendor/profile`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`, // Assumes a token-based authentication
    });
    return this.http.get<any>(url, { headers });
  }

  /**
   * Retrieve the token from local storage or another source.
   * @returns string
   */
  private getToken(): string {
    return localStorage.getItem('authToken') || ''; // Replace with your token storage logic
  }
}
