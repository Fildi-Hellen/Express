import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from 'src/app/Services/vendor.service';

@Component({
  selector: 'app-vendor-login',
  templateUrl: './vendor-login.component.html',
  styleUrls: ['./vendor-login.component.css']
})
export class VendorLoginComponent {


  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private vendorService: VendorService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  

  login() {
    if (this.loginForm.valid) {
      this.vendorService.loginVendor(this.loginForm.value).subscribe(
        (response: any) => {
          // Navigate to dashboard on successful login
          this.errorMessage = '';
          window.location.href = '/vendor/dashboard';
        },
        (error) => {
          // Display error message
          this.errorMessage = error.error.message || 'Invalid login credentials.';
        }
      );
    }
  }

}
