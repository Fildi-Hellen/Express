import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  isLoggedIn: boolean = false;
  userData: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // this.checkAuthenticationStatus();
  }

  // checkAuthenticationStatus() {
  //   this.isLoggedIn = this.authService.isLoggedIn();
  //   if (this.isLoggedIn) {
  //     this.userData = this.authService.getUserData(); 
  //   }
  // }

  logout() {
    this.authService.logout();
    // Optionally, you can clear userData here
    this.userData = {};
    this.isLoggedIn = false;
  }

}
