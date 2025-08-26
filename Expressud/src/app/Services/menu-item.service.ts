import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {

private base = environment.apiBase;
  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<any> {
    return this.http.get(this.base);
  }

  createMenuItem(menuItem: any): Observable<any> {
    return this.http.post(this.base, menuItem);
  }

  updateMenuItem(id: number, menuItem: any): Observable<any> {
    return this.http.put(`${this.base}/${id}`, menuItem);
  }

  deleteMenuItem(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }

  approveMenuItem(id: number): Observable<any> {
    return this.http.put(`${this.base}/${id}/approve`, {});
  }
  
  getCategories(): Observable<any> {
    return this.http.get(`${this.base}/categories`);
  }

  getMenusByCategory(category: string): Observable<any> {
    return this.http.get(`${this.base}/menus`, { params: { category } });
  }

  getEstablishmentsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.base}/establishments`, { params: { category } });
  }
  
  getMenusByEstablishment(establishmentName: string): Observable<any> {
    return this.http.get(`${this.base}/menus-by-establishment`, {
      params: { establishmentName },
    });
  }
  


}
