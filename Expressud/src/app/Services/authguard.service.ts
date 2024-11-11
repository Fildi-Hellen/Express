import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService {

  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data.expectedRoles;
    const userRoles = this.authService.getCurrentUserRoles();

    if (this.authService.isAuthenticated() && this.authService.hasRequiredRole(expectedRoles)) {
      return true;
    } else {
      // Redirect to the login page or display an error message
      this.router.navigate(['/login']);
      return false;
    }
  }
}
