import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

private base = environment.apiBase;

  constructor(private http: HttpClient) { }

  updatePersonalInfo(data: any): Observable<any> {
    return this.http.put(`${this.base}/personal-info`, data);
  }

  updateBusinessInfo(data: any): Observable<any> {
    return this.http.put(`${this.base}/business-info`, data);
  }

  changeLoginCredentials(data: any): Observable<any> {
    return this.http.put(`${this.base}/login-credentials`, data);
  }

  updateNotificationPreferences(data: any): Observable<any> {
    return this.http.put(`${this.base}/notification-preferences`, data);
  }

  updatePaymentMethods(data: any): Observable<any> {
    return this.http.post(`${this.base}/payment-methods`, data);
  }

  updateTaxSettings(data: any): Observable<any> {
    return this.http.put(`${this.base}/tax-settings`, data);
  }

  manageSubscriptions(data: any): Observable<any> {
    return this.http.put(`${this.base}/subscriptions`, data);
  }

  updateSecuritySettings(data: any): Observable<any> {
    return this.http.put(`${this.base}/security-settings`, data);
  }

  
}
