// auth.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginFormVisible: boolean = true;
  isRegisterFormVisible: boolean = false;
  isForgotPasswordVisible: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  toggleLoginForm() {
    this.isLoginFormVisible = true;
    this.isRegisterFormVisible = false;
    this.isForgotPasswordVisible = false;
  }

  toggleRegisterForm() {
    this.isLoginFormVisible = false;
    this.isRegisterFormVisible = true;
    this.isForgotPasswordVisible = false;
  }

  toggleForgotPassword() {
    this.isLoginFormVisible = false;
    this.isRegisterFormVisible = false;
    this.isForgotPasswordVisible = true;
  }

  login() {
    if (this.loginForm.valid) {
      // Implement login functionality
    } else {
      // Show error messages
    }
  }

  register() {
    if (this.registerForm.valid) {
      // Implement registration functionality
      // Redirect to login form
      this.toggleLoginForm();
    } else {
      // Show error messages
    }
  }

  loginWithGoogle() {
    // Implement Google authentication
  }

  loginWithFacebook() {
    // Implement Facebook authentication
  }
}
