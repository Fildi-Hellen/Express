import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

 
  apiEndPoint: string = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getAllPharms(): Observable<any> {
    return this.http.get(`${this.apiEndPoint}/categories/47`);
  }

  getPharmaciesByCategoryId(categoryId: number): Observable<any> {
    return this.http.get(`${this.apiEndPoint}/categories/${categoryId}/pharmacies`);
  }

  getPharmItemsByPharmacyAndCategory(pharmacyId: number, categoryId: number): Observable<any> {
    const params = new HttpParams()
      .set('pharmacyId', pharmacyId.toString())
      .set('categoryId', categoryId.toString());

    return this.http.get(`${this.apiEndPoint}/pharm-items`, { params });
  }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiEndPoint}/place-order`, orderData);
  }
 
}
