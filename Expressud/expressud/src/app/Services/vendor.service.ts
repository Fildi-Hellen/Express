import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  private apiUrl = 'http://127.0.0.1:8000/api/vendors'; // replace with your backend URL

  constructor(private http: HttpClient) { }

  registerVendor(vendorData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, vendorData);
  }
}
