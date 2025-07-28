// src/app/guards/vendor-auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class VendorAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

 canActivate(): boolean {
  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/vendorlogin']);
    return false;
  }
  return true;
}
}
