import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  private baseUrl = 'http://127.0.0.1:8000/api'; // replace with your backend URL

  constructor(private http: HttpClient) { }

  
/**
   * Register a new vendor.
   * @param vendorData Vendor registration data
   * @returns Observable<any>
   */
  registerVendor(vendorData: any): Observable<any> {
    const url = `${this.baseUrl}/vendor/register`;
    return this.http.post<any>(url, vendorData);
  }

  loginVendor(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/vendor/login`, data);
  }
  
  resetPassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/vendor/forgot-password`, data);
  }
  

  /**
   * Get the profile of the currently authenticated vendor.
   * @returns Observable<any>
   */
  getVendorProfile(): Observable<any> {
    const url = `${this.baseUrl}/vendor/profile`;
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
