import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private apiUrl = 'http://your-api-url/api/vendor';

  constructor(private http: HttpClient) { }

  updatePersonalInfo(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/personal-info`, data);
  }

  updateBusinessInfo(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/business-info`, data);
  }

  changeLoginCredentials(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/login-credentials`, data);
  }

  updateNotificationPreferences(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/notification-preferences`, data);
  }

  updatePaymentMethods(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment-methods`, data);
  }

  updateTaxSettings(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tax-settings`, data);
  }

  manageSubscriptions(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/subscriptions`, data);
  }

  updateSecuritySettings(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/security-settings`, data);
  }

  
}
