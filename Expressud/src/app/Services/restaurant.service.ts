import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiEndPoint: string = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<any> {
    return this.http.get(`${this.apiEndPoint}/menu-items`);
  }

  addMenuItem(menuItem: any): Observable<any> {
    return this.http.post(`${this.apiEndPoint}/menu-items`, menuItem);
  }

  updateMenuItem(itemID: number, menuItem: any): Observable<any> {
    return this.http.put(`${this.apiEndPoint}/menu-items/${itemID}`, menuItem);
  }

  deleteMenuItem(itemID: number): Observable<any> {
    return this.http.delete(`${this.apiEndPoint}/menu-items/${itemID}`);
  }
}
