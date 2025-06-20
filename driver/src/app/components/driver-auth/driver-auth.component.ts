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
  phone = '';
  vehicleType = '';
  vehicleNumber = '';
  

  constructor(private driverService: DriverService, private router: Router) {}

  toggleAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit() {
  if (this.isLogin) {
    this.driverService.loginDriver({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        alert('Login successful');
        this.router.navigate(['/dashboard']); // Or any route
      },
      error: (err) => {
        alert('Login failed');
        console.error(err);
      }
    });
  } else {
    this.driverService.registerDriver({
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      vehicle_type: this.vehicleType,
      vehicle_number: this.vehicleNumber
    }).subscribe({
      next: () => {
        alert('Registration successful');
        this.isLogin = true;
      },
      error: (err) => {
        alert('Registration failed');
        console.error(err);
      }
    });
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
