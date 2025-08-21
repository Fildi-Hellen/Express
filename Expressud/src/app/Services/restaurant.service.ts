import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
private base = environment.apiBase;
  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<any> {
    return this.http.get(`${this.base}/menu-items`);
  }

  addMenuItem(menuItem: any): Observable<any> {
    return this.http.post(`${this.base}/menu-items`, menuItem);
  }

  updateMenuItem(itemID: number, menuItem: any): Observable<any> {
    return this.http.put(`${this.base}/menu-items/${itemID}`, menuItem);
  }

  deleteMenuItem(itemID: number): Observable<any> {
    return this.http.delete(`${this.base}/menu-items/${itemID}`);
  }
}
