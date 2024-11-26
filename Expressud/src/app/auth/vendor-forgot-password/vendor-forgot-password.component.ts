import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from 'src/app/Services/vendor.service';

@Component({
  selector: 'app-vendor-forgot-password',
  templateUrl: './vendor-forgot-password.component.html',
  styleUrl: './vendor-forgot-password.component.css'
})
export class VendorForgotPasswordComponent {

  forgotPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private vendorService: VendorService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  resetPassword() {
    if (this.forgotPasswordForm.valid) {
      this.vendorService.resetPassword(this.forgotPasswordForm.value).subscribe(
        (response: any) => {
          this.successMessage = 'Password reset link sent to your email.';
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = error.error.message || 'Error sending reset link.';
          this.successMessage = '';
        }
      );
    }
  }

}
