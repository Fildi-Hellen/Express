import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api'; 


  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(name: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password, password_confirmation: confirmPassword });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
