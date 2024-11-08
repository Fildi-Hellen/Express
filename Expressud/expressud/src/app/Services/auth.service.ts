import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';


interface AuthResponse {
  token: string;
  user: any; // Adjust the type according to your user structure
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';

   // Create a BehaviorSubject to track the authentication status
  private authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.setUser(response.user);
        this.authStatusSubject.next(true); // Emit the new authentication status
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/customer`, user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('Expressud_user');
    this.authStatusSubject.next(false); // Emit the new authentication status
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  setUser(user: any) {
    localStorage.setItem('Expressud_user', JSON.stringify(user));
  }

  getUser() {
    const localData = localStorage.getItem('Expressud_user');
    return localData ? JSON.parse(localData) : null;
  }
  
}
