import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createMenuItem(menuItem: any): Observable<any> {
    return this.http.post(this.apiUrl, menuItem);
  }

  updateMenuItem(id: number, menuItem: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, menuItem);
  }

  deleteMenuItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  approveMenuItem(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }
  
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  getMenusByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/menus`, { params: { category } });
  }

  getEstablishmentsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/establishments`, { params: { category } });
  }
  
  getMenusByEstablishment(establishmentName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/menus-by-establishment`, {
      params: { establishmentName },
    });
  }
  


}
