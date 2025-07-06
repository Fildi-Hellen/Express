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
        next: (response) => {
          alert('Login successful');
          // Store driver info
          if (response.driver && response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('driverId', response.driver.id);
          }
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login error:', err);
          if (err.error && err.error.message) {
            alert(`Login failed: ${err.error.message}`);
          } else {
            alert('Login failed. Please check your credentials.');
          }
        }
      });
    } else {
      // Validate required fields
      if (!this.name || !this.email || !this.password || !this.phone || !this.vehicleType || !this.vehicleNumber) {
        alert('Please fill in all required fields');
        return;
      }
      
      this.driverService.registerDriver({
        name: this.name,
        email: this.email,
        password: this.password,
        phone: this.phone,
        vehicle_type: this.vehicleType,
        vehicle_number: this.vehicleNumber
      }).subscribe({
        next: (response) => {
          alert('Registration successful! You can now login.');
          // Optionally auto-login after registration
          if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('driverId', response.driver.id);
            this.router.navigate(['/dashboard']);
          } else {
            // Clear form and switch to login
            this.clearForm();
            this.isLogin = true;
          }
        },
        error: (err) => {
          console.error('Registration error:', err);
          if (err.error && err.error.errors) {
            // Handle validation errors
            const errors = err.error.errors;
            let errorMessage = 'Registration failed:\n';
            Object.keys(errors).forEach(key => {
              errorMessage += `${key}: ${errors[key].join(', ')}\n`;
            });
            alert(errorMessage);
          } else if (err.error && err.error.message) {
            alert(`Registration failed: ${err.error.message}`);
          } else {
            alert('Registration failed. Please try again.');
          }
        }
      });
    }
  }
  
  clearForm() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.phone = '';
    this.vehicleType = '';
    this.vehicleNumber = '';
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
