import { HttpClient,  HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FoodService {

  apiEndPoint: string = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getAllFoods(): Observable<any> {
    return this.http.get(`${this.apiEndPoint}/categories/from-36-to-46`);
  }

  getRestaurantServingByCategoryId(categoryId: number): Observable<any> {
    return this.http.get(`${this.apiEndPoint}/categories/${categoryId}/restaurants`);
  }

  getFoodItemsByRestaurantAndCategory(restaurantId: number, categoryId: number): Observable<any> {
    const params = new HttpParams()
      .set('restaurantId', restaurantId.toString())
      .set('categoryId', categoryId.toString());

    return this.http.get(`${this.apiEndPoint}/food-items`, { params });
  }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiEndPoint}/place-order`, orderData);
  }
 
}

