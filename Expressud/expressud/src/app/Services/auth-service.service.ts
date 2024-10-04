import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../Shared1/models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  
  constructor() {
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) as User : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(currentUser);
    this.user = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    // Check if there is a logged-in user
    return !!this.currentUserValue;
  }

  getCurrentUserRoles(): string[] {
    // Implement logic to get roles of the current user
    // For example, you can retrieve roles from the user object or from the backend
    return this.currentUserValue ? this.currentUserValue.roles : [];
  }

  hasRequiredRole(expectedRoles: string[]): boolean {
    // Check if the current user has any of the expected roles
    const userRoles = this.getCurrentUserRoles();
    return expectedRoles.some(role => userRoles.includes(role));
  }

  login(username: string, password: string) {
    // Implement login logic
  }

  logout() {
    // Implement logout logic
  }
}
