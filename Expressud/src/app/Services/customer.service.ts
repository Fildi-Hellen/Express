import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from '../Models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getMenus(establishmentType: string = '') {
    let url = `${this.baseUrl}/menus`;
    if (establishmentType) {
      url += `?establishmentType=${establishmentType}`;
    }
    return this.http.get<any[]>(url);
  }
  getMenuById(id: string): Observable<Menu> {
    return this.http.get<Menu>(`${this.baseUrl}/menus/${id}`);
  }

}
