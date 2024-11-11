import { Component } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-admin-registration',
  templateUrl: './admin-registration.component.html',
  styleUrl: './admin-registration.component.css'
})
export class AdminRegistrationComponent {

  admin = {
    fullName: '',
    password: '',
    confirmPassword: '',
    email: '',
    adminNumber: '',
    role: 'admin' // Set default role
  };

  constructor(private authService: AuthService) { }

  // registerAdmin(): void {
  //   this.authService.registerAdmin(this.admin).subscribe(
  //     (res: any) => {
  //       console.log('Admin registered successfully:', res);
  //       // Optionally, redirect to a success page or display a success message
  //     },
  //     (err: any) => {
  //       console.error('Error registering admin:', err);
  //       // Handle registration error, e.g., display error message
  //     }
  //   );
  // }

}
