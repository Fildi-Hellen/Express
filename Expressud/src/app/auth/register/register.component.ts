import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] 
})
export class RegisterComponent {
  
  registrationData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    if (this.registrationData.password !== this.registrationData.confirmPassword) {
      // Handle password mismatch error (e.g., show error message)
      return;
    }

    const payload = {
      fullName: this.registrationData.fullName,
      email: this.registrationData.email,
      password: this.registrationData.password,
      password_confirmation: this.registrationData.confirmPassword
    };

    this.authService.register(payload).subscribe(
      (res: any) => {
        // Redirect to login page after successful registration
        this.router.navigate(['/login']);
      },
      (err: any) => console.error(err)
    );
  }
  
}
