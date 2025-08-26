import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.base);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }

}
