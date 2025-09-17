import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  
private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  getVendorProfile() {
    return this.http.get(`${this.base}/vendor/profile`);
  }

  addMenuItem(data: FormData) {
    return this.http.post<any>(`${this.base}/menu`,data);
  }

  deleteMenuItem(id: string) {
    return this.http.delete(`${this.base}/menu/${id}`);
  }
  

  submitToAdmin(menus: any[]): Observable<any> {
    return this.http.post(`${this.base}/submit-menus`, { menus });
  }

}
