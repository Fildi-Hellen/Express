import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment'; // Import environment for API URL
import { IUserLogin } from '../Shared1/interfaces/IUserLogin';
import { IUserRegister } from '../Shared1/interfaces/IUserRegister';
import { User } from '../Shared1/models/User';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root'
  
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser(): User {
    return this.userSubject.value;
  }

  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/login`, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(`Welcome to Expressud ${user.name}!`, 'Login Successful');
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error.message, 'Login Failed');
        }
      })
    );
  }

  register(userRegiser: IUserRegister): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/register`, userRegiser).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(`Welcome to the Expressud ${user.name}`, 'Register Successful');
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error.message, 'Register Failed');
        }
      })
    );
  }

  logout() {
    return this.http.post(`${environment.apiUrl}/logout`, {}).pipe(
      tap(() => {
        const user = new User(); // Create a new empty user object
        this.setUserToLocalStorage(user); // Save empty user to local storage
        this.userSubject.next(user); // Update the user subject
        this.toastrService.success('Logged out successfully');
        // Optionally, redirect to the login page after logout
        // window.location.reload();
      })
    );
  }
  

  private setUserToLocalStorage(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) as User : new User();
  }
}

