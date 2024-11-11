import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {

  private apiUrl = `${environment.apiUrl}/menu-items`;

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
}
