import { Component } from '@angular/core';
import { DriverService } from '../../Services/driver.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-auth',
  standalone: false,
  
  templateUrl: './driver-auth.component.html',
  styleUrls: ['./driver-auth.component.css']
})
export class DriverAuthComponent {

  isLogin = true; // Toggle between login and registration
  name = '';
  email = '';
  password = '';
  

  constructor(private driverService: DriverService, private router: Router) {}

  toggleAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit() {
    if (this.isLogin) {
      this.driverService.loginDriver({ email: this.email, password: this.password }).subscribe(
        () => alert('Login successful'),
        (error) => console.error('Login error', error)
      );
    } else {
      this.driverService.registerDriver({ name: this.name, email: this.email, password: this.password }).subscribe(
        () => alert('Registration successful'),
        (error) => console.error('Registration error', error)
      );
    }
  }
  login(): void {
    this.driverService.loginDriver({ email: this.email, password: this.password }).subscribe({
      next: () => {
        alert('Login successful!');
        this.router.navigate(['/orders']); // Redirect to orders after login
      },
      error: (error: any) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      },
    });
  }
  

}
