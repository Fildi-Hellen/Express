import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] 
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  passwordStrength = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register(this.name, this.email, this.password, this.confirmPassword).subscribe(
      () => {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = error.error || 'Registration failed';
      }
    );
  }

  checkPasswordStrength(): void {
    const strength = this.password.length >= 8 ? 'Strong' : 'Weak';
    this.passwordStrength = strength;
  }
}
