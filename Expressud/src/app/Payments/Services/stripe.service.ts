import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';



@Injectable({
  providedIn: 'root'
})
export class StripeService {
private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  initiatePayment(payload: any): Observable<any> {
    return this.http.post(`${this.base}/pay/initiate`, payload);
  }

  // Optional future addition
  confirmWebhook(data: any): Observable<any> {
    return this.http.post(`${this.base}/webhook/flutterwave`, data);
  }



}
