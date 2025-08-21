import { HttpClient,  HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable} from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FoodService {

private base = environment.apiBase;
  constructor(private http: HttpClient) {}

  getAllFoods(): Observable<any> {
    return this.http.get(`${this.base}/categories/from-36-to-46`);
  }

  getRestaurantServingByCategoryId(categoryId: number): Observable<any> {
    return this.http.get(`${this.base}/categories/${categoryId}/restaurants`);
  }

  getFoodItemsByRestaurantAndCategory(restaurantId: number, categoryId: number): Observable<any> {
    const params = new HttpParams()
      .set('restaurantId', restaurantId.toString())
      .set('categoryId', categoryId.toString());

    return this.http.get(`${this.base}/food-items`, { params });
  }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.base}/place-order`, orderData);
  }
 
}

