import { Component } from '@angular/core';
import { VendorService } from '../../Services/vendor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendorlogin',
  templateUrl: './vendorlogin.component.html',
  styleUrl: './vendorlogin.component.css'
})
export class VendorloginComponent {
   isRegisterMode = false;
  name = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private vendorservice: VendorService, private router: Router) {}

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  submit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isRegisterMode) {
      this.registerVendor();
    } else {
      this.loginVendor();
    }
  }

  private registerVendor() {
    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.vendorservice.register(data).subscribe({
      next: () => {
        this.successMessage = 'Registration successful. Please login.';
        this.isRegisterMode = false;
        this.name = '';
        this.password = '';
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Registration failed.';
      },
    });
  }

  private loginVendor() {
    const data = {
      email: this.email,
      password: this.password,
    };

    this.vendorservice.login(data).subscribe({
      next: (res: any) => {
        localStorage.setItem('authToken', res.token);
        this.router.navigate(['/vendor/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Login failed.';
      },
    });
  }
  
}
