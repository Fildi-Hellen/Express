import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from '../Models/menu.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

 private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  getMenus(establishmentType: string = '') {
    let url = `${this.base}/menus`;
    if (establishmentType) {
      url += `?establishmentType=${establishmentType}`;
    }
    return this.http.get<any[]>(url);
  }
  getMenuById(id: string): Observable<Menu> {
    return this.http.get<Menu>(`${this.base}/menus/${id}`);
  }

}
