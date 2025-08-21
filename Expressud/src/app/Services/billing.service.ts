import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

private base = environment.apiBase;
  constructor(private http: HttpClient) { }

  sendBillingInfo(billingInfo: any): Observable<any> {
    return this.http.post(`${this.base}/billing`, billingInfo);
  }

  getAcceptedBillingInfo(): Observable<any> {
    return this.http.get(`${this.base}/billing/accepted`);
  }
}
