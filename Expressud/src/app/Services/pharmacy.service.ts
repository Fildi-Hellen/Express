import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

 
private base = environment.apiBase;
  constructor(private http: HttpClient) {}

  getAllPharms(): Observable<any> {
    return this.http.get(`${this.base}/categories/47`);
  }

  getPharmaciesByCategoryId(categoryId: number): Observable<any> {
    return this.http.get(`${this.base}/categories/${categoryId}/pharmacies`);
  }

  getPharmItemsByPharmacyAndCategory(pharmacyId: number, categoryId: number): Observable<any> {
    const params = new HttpParams()
      .set('pharmacyId', pharmacyId.toString())
      .set('categoryId', categoryId.toString());

    return this.http.get(`${this.base}/pharm-items`, { params });
  }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.base}/place-order`, orderData);
  }
 
}
